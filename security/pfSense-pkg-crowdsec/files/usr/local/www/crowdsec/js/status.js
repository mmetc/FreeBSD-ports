/* global moment, $ */
/* exported CrowdSec */
/* eslint no-undef: "error" */
/* eslint semi: "error" */

const CrowdSec = (function () {
    'use strict';

    const api_url = '/crowdsec/status/api.php';
    const _refreshTemplate = '<button class="btn btn-default" type="button" title="Refresh"><span class="icon fa fa-refresh"></span></button>';

    const _dataFormatters = {
        yesno: function (column, row) {
            return _yesno2html(row[column.id]);
        },

        delete: function (column, row) {
            var val = row.id;
            if (isNaN(val)) {
                return '';
            }
            return '<button type="button" class="btn btn-secondary btn-sm" value="' + val + '" onclick="CrowdSec.deleteDecision(' + val + ')"><i class="fa fa-trash" /></button>';
        },

        duration: function (column, row) {
            var duration = row[column.id];
            if (!duration) {
                return 'n/a';
            }
            return $('<div>').attr({
                'data-toggle': 'tooltip',
                'data-placement': 'left',
                title: duration
            }).text(_humanizeDuration(duration)).prop('outerHTML');
        },

        datetime: function (column, row) {
            var dt = row[column.id];
            var parsed = moment(dt);
            if (!dt) {
                return '';
            }
            if (!parsed.isValid()) {
                console.error('Cannot parse timestamp: %s', dt);
                return '???';
            }
            return $('<div>').attr({
                'data-toggle': 'tooltip',
                'data-placement': 'left',
                title: parsed.format()
            }).text(_humanizeDate(dt)).prop('outerHTML');
        }
    };

    function _decisionsByType(decisions) {
        const dectypes = {};
        if (!decisions) {
            return '';
        }
        decisions.map(function (decision) {
            // TODO ignore negative expiration?
            dectypes[decision.type] = dectypes[decision.type] ? (dectypes[decision.type] + 1) : 1;
        });
        let ret = '';
        for (const type in dectypes) {
            if (ret !== '') {
                ret += ' ';
            }
            ret += (type + ':' + dectypes[type]);
        }
        return ret;
    }

    function _updateFreshness (selector, timestamp) {
        var $freshness = $(selector).find('.actionBar .freshness');
        if (timestamp) {
            $freshness.data('refresh_timestamp', timestamp);
        } else {
            timestamp = $freshness.data('refresh_timestamp');
        }
        var howlongHuman = '???';
        if (timestamp) {
            var howlongms = moment() - moment(timestamp);
            howlongHuman = moment.duration(howlongms).humanize();
        }
        $freshness.text(howlongHuman + ' ago');
    }

    function _addFreshness (selector) {
        // this creates one timer per tab
        var freshnessTemplate = '<span style="float:left">Last refresh: <span class="freshness"></span></span>';
        $(selector).find('.actionBar').prepend(freshnessTemplate);
        setInterval(function () {
            _updateFreshness(selector);
        }, 5000);
    }

    function _refreshTab (selector, action, dataCallback) {
        $.ajax({
            url: api_url,
            cache: false,
            dataType: 'json',
            data: {action: action},
            type: 'POST',
            method: 'POST',
            success: dataCallback
        })
        _updateFreshness(selector, moment());
    }

    function _parseDuration (duration) {
        var re = /(-?)(?:(?:(\d+)h)?(\d+)m)?(\d+).\d+(m?)s/m;
        var matches = duration.match(re);
        var seconds = 0;

        if (!matches.length) {
            throw new Error('Unable to parse the following duration: ' + duration + '.');
        }
        if (typeof matches[2] !== 'undefined') {
            seconds += parseInt(matches[2], 10) * 3600; // hours
        }
        if (typeof matches[3] !== 'undefined') {
            seconds += parseInt(matches[3], 10) * 60; // minutes
        }
        if (typeof matches[4] !== 'undefined') {
            seconds += parseInt(matches[4], 10); // seconds
        }
        if (parseInt(matches[5], 10) === 'm') {
            // units in milliseconds
            seconds *= 0.001;
        }
        if (parseInt(matches[1], 10) === '-') {
            // negative
            seconds = -seconds;
        }
        return seconds;
    }

    function _humanizeDate (text) {
        return moment(text).fromNow();
    }

    function _humanizeDuration (text) {
        return moment.duration(_parseDuration(text), 'seconds').humanize();
    }

    function _yesno2html (val) {
        if (val) {
            return '<i class="fa fa-check text-success"></i>';
        } else {
            return '<i class="fa fa-times text-danger"></i>';
        }
    }

    function _initTab(selector, action, dataCallback) {
        const tab = $(selector);
        const table = tab.find('table.crowdsecTable');
        if (!table.length) {
            return;
        }
        // Navigation
        window.location.hash = selector;
        history.pushState(null, null, window.location.hash);
        table.on('initialized.rs.jquery.bootgrid', function () {
            $(_refreshTemplate).on('click', function () {
                _refreshTab(selector, action, dataCallback);
            }).insertBefore(tab.find('.actionBar .actions .dropdown:first'));
            _addFreshness(selector);
            _refreshTab(selector, action, dataCallback);
        }).bootgrid({
            caseSensitive: false,
            formatters: _dataFormatters
        });
    }

    function _initMachines() {
        const action = 'machines-list';
        const id = '#tab-machines';
        const dataCallback = function (data) {
            const rows = [];
            data.map(function (row) {
                rows.push({
                    name: row.machineId,
                    ip_address: row.ipAddress || ' ',
                    last_update: row.updated_at || ' ',
                    validated: row.isValidated,
                    version: row.version || ' '
                });
            });
            $(id + ' table').bootgrid('clear').bootgrid('append', rows);
        };
        _initTab(id, action, dataCallback);
    }

    function _initCollections() {
        const action = 'collections-list';
        const id = "#tab-collections";
        const dataCallback = function (data) {
            const rows = [];
            data.collections.map(function (row) {
                rows.push({
                    name: row.name,
                    status: row.status,
                    local_version: row.local_version || ' ',
                    local_path: row.local_path || ' '
                });
            });
            $(id + ' table').bootgrid('clear').bootgrid('append', rows);
        };
        _initTab(id, action, dataCallback);
    }

    function _initScenarios() {
        const action = 'scenarios-list';
        const id = "#tab-scenarios";
        const dataCallback = function (data) {
            const rows = [];
            data.scenarios.map(function (row) {
                rows.push({
                    name: row.name,
                    status: row.status,
                    local_version: row.local_version || ' ',
                    local_path: row.local_path || ' ',
                    description: row.description || ' '
                });
            });
            $(id + ' table').bootgrid('clear').bootgrid('append', rows);
        };
        _initTab(id, action, dataCallback);
    }

    function _initParsers() {
        const action = 'parsers-list';
        const id = "#tab-parsers";
        const dataCallback = function (data) {
            const rows = [];
            data.parsers.map(function (row) {
                rows.push({
                    name: row.name,
                    status: row.status,
                    local_version: row.local_version || ' ',
                    local_path: row.local_path || ' ',
                    description: row.description || ' '
                });
            });
            $(id + ' table').bootgrid('clear').bootgrid('append', rows);
        };
        _initTab(id, action, dataCallback);
    }

    function _initPostoverflows() {
        const action = 'postoverflows-list';
        const id = "#tab-postoverflows";
        const dataCallback = function (data) {
            const rows = [];
            data.postoverflows.map(function (row) {
                rows.push({
                    name: row.name,
                    status: row.status,
                    local_version: row.local_version || ' ',
                    local_path: row.local_path || ' ',
                    description: row.description || ' '
                });
            });
            $(id + ' table').bootgrid('clear').bootgrid('append', rows);
        };
        _initTab(id, action, dataCallback);
    }

    function _initBouncers() {
        const action = 'bouncers-list';
        const id = "#tab-bouncers";
        const dataCallback = function (data) {
            const rows = [];
            data.map(function (row) {
                // TODO - remove || ' ' later, it was fixed for 1.3.3
                rows.push({
                    name: row.name,
                    ip_address: row.ip_address || ' ',
                    valid: !row.revoked,
                    last_pull: row.last_pull,
                    type: row.type || ' ',
                    version: row.version || ' '
                });
            });
            $(id + ' table').bootgrid('clear').bootgrid('append', rows);
        };
        _initTab(id, action, dataCallback);
    }

    function _initAlerts() {
        const action = 'alerts-list';
        const id = "#tab-alerts";
        const dataCallback = function (data) {
            const rows = [];
            data.map(function (row) {
                rows.push({
                    id: row.id,
                    value: row.source.scope + (row.source.value ? (':' + row.source.value) : ''),
                    reason: row.scenario || ' ',
                    country: row.source.cn || ' ',
                    as: row.source.as_name || ' ',
                    decisions: _decisionsByType(row.decisions) || ' ',
                    created_at: row.created_at
                });
            });
            $(id + ' table').bootgrid('clear').bootgrid('append', rows);
        };
        _initTab(id, action, dataCallback);
    }

    function _initDecisions() {
        const action = 'decisions-list';
        const id = "#tab-decisions";
        const dataCallback = function (data) {
            const rows = [];
            data.map(function (row) {
                row.decisions.map(function (decision) {
                    // ignore deleted decisions
                    if (decision.duration.startsWith('-')) {
                        return;
                    }
                    rows.push({
                        // search will break on empty values when using .append(). so we use spaces
                        delete: '',
                        id: decision.id,
                        source: decision.origin || ' ',
                        scope_value: decision.scope + (decision.value ? (':' + decision.value) : ''),
                        reason: decision.scenario || ' ',
                        action: decision.type || ' ',
                        country: row.source.cn || ' ',
                        as: row.source.as_name || ' ',
                        events_count: row.events_count,
                        // XXX pre-parse duration to seconds, and integer type, for sorting
                        expiration: decision.duration || ' ',
                        alert_id: row.id || ' '
                    });
                });
            });
            $(id + ' table').bootgrid('clear').bootgrid('append', rows);
        };
        _initTab(id, action, dataCallback);
    }

    function deleteDecision(decisionId) {
        const $modal = $('#delete-decision-modal');
        const action = 'decision-delete';

        $modal.find('.modal-title').text('Delete decision #' + decisionId);
        $modal.find('.modal-body').text('Are you sure?');
        $modal.modal('show');
        $modal.find('#delete-decision-confirm').on('click', function () {
            $.ajax({
                // XXX handle errors
                url: api_url + '?action=' + action + '&decision_id=' + decisionId,
                type: 'DELETE',
                method: 'DELETE',
                dataType: 'json',
                success: function (result) {
                    if (result && result.message === 'OK') {
                        $('#tab-decisions table').bootgrid('remove', [decisionId]);
                    }
                }
            });
        });
    }

    function _handleHash(hash) {
        switch (hash) {
            case '#tab-alerts':
                _initAlerts();
                break;
            case '#tab-bouncers':
                _initBouncers();
                break;
            case '#tab-collections':
                _initCollections();
                break;
            case '#tab-decisions':
                _initDecisions();
                break;
            case '#tab-machines':
                _initMachines();
                break;
            case '#tab-parsers':
                _initParsers();
                break;
            case '#tab-postoverflows':
                _initPostoverflows();
                break;
            case '#tab-scenarios':
                _initScenarios();
                break;
            default:
                _initMachines();

        }
    }



    function init() {
        // Machines tab is the first to be visible
        $("#tabs").tabs({
            activate: function (event, ui) {
                switch (ui.newPanel[0].id) {
                    case 'tab-alerts':
                        _initAlerts();
                        break;
                    case 'tab-bouncers':
                        _initBouncers();
                        break;
                    case 'tab-collections':
                        _initCollections();
                        break;
                    case 'tab-decisions':
                        _initDecisions();
                        break;
                    case 'tab-machines':
                        _initMachines();
                        break;
                    case 'tab-parsers':
                        _initParsers();
                        break;
                    case 'tab-postoverflows':
                        _initPostoverflows();
                        break;
                    case 'tab-scenarios':
                        _initScenarios();
                        break;
                    default:
                        break
                }
            }
        });
        // activate a tab from the hash, if it exists
        _handleHash(window.location.hash);

        $(window).on('hashchange', function (e) {
            _handleHash(window.location.hash);
        });

        $(window).on('popstate', function(event) {
            _handleHash(window.location.hash);
        });
    }

    return {
        deleteDecision: deleteDecision,
        init: init
    };
}());
