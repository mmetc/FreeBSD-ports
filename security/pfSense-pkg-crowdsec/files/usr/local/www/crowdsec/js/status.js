/* global moment, $ */
/* exported CrowdSec */
/* eslint no-undef: "error" */
/* eslint semi: "error" */

const CrowdSec = (function () {
    'use strict';

    const api_url = '/crowdsec/status/api.php';
    const default_result = 'No results found';

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

    function _getDeleteButton(decision) {
        const val = decision.id;
        if (isNaN(val)) {
            return '';
        }
        return '<button type="button" class="btn btn-secondary btn-sm" value="' + val + '" onclick="CrowdSec.deleteDecision(' + val + ')"><i class="fa fa-trash" /></button>';
    }

    function _initTab(selector, action, dataCallback) {
        const tab = $(selector);
        const table = tab.find('table.crowdsecTable');
        if (!table.length) {
            return;
        }
        const search = table.find('.fancySearchRow');
        if (search.length) {
            search.remove();
        }
        const pagination = table.find('tfoot .pag');
        if (pagination.length) {
            pagination.remove();
        }
        table.find('tbody').html('<div class="loading">\n' +
            '\t<i class="fa fa-spinner fa-spin"></i> Loading, please wait...\n' +
            '</div>');

        $.ajax({
            url: api_url,
            cache: false,
            dataType: 'json',
            data: {action: action},
            type: 'POST',
            method: 'POST',
            success: dataCallback
        })
    }

    function _initMachines() {
        const action = 'machines-list';
        const dataCallback = function (data) {
            const rows = [];
            let count = 0;
            const perPage = 10;
            data.map(function (row) {
                rows.push({
                    name: row.machineId,
                    ip_address: row.ipAddress || ' ',
                    last_update: row.updated_at || ' ',
                    validated: row.isValidated,
                    version: row.version || ' '
                });
            });
            let content = '';
            if (!rows.length) {
                content = default_result;
            }
            for (const line of rows) {
                content += '<tr>' +
                    '<td>' + line['name'] + '</td>' +
                    '<td>' + line['ip_address'] + '</td>' +
                    '<td>' + line['last_update'] + '</td>' +
                    '<td>' + line['validated'] + '</td>' +
                    '<td>' + line['version'] + '</td>' +
                    '</tr>';
                count++;
            }

            $('#tab-machines table tbody').html(content);
            $("#machinesTable").fancyTable({
                sortColumn: 0,
                pagination: count > perPage,
                searchable: true,
                sortable: true,
                perPage: perPage,
                globalSearch: true
            });
        };
        _initTab('#tab-machines', action, dataCallback);
    }

    function _initCollections() {
        const action = 'collections-list';
        const dataCallback = function (data) {
            const rows = [];
            let count = 0;
            const perPage = 10;
            data.collections.map(function (row) {
                rows.push({
                    name: row.name,
                    status: row.status,
                    local_version: row.local_version || ' ',
                    local_path: row.local_path || ' '
                });
            });
            let content = '';
            if (!rows.length) {
                content = default_result;
            }
            for (const line of rows) {
                content += '<tr>' +
                    '<td>' + line['name'] + '</td>' +
                    '<td>' + line['status'] + '</td>' +
                    '<td>' + line['local_version'] + '</td>' +
                    '<td>' + line['local_path'] + '</td>' +
                    '</tr>';
                count++;
            }

            $('#tab-collections table tbody').html(content);
            $("#collectionsTable").fancyTable({
                sortColumn: 0,
                pagination: count > perPage,
                searchable: true,
                sortable: true,
                perPage: perPage,
                globalSearch: true
            });
        };
        _initTab('#tab-collections', action, dataCallback);
    }

    function _initScenarios() {
        const action = 'scenarios-list';
        const dataCallback = function (data) {
            const rows = [];
            let count = 0;
            const perPage = 10;
            data.scenarios.map(function (row) {
                rows.push({
                    name: row.name,
                    status: row.status,
                    local_version: row.local_version || ' ',
                    local_path: row.local_path || ' ',
                    description: row.description || ' '
                });
            });
            let content = '';
            if (!rows.length) {
                content = default_result;
            }
            for (const line of rows) {
                content += '<tr>' +
                    '<td>' + line['name'] + '</td>' +
                    '<td>' + line['status'] + '</td>' +
                    '<td>' + line['local_version'] + '</td>' +
                    '<td>' + line['local_path'] + '</td>' +
                    '<td>' + line['description'] + '</td>' +
                    '</tr>';
                count++;
            }

            $('#tab-scenarios table tbody').html(content);
            $("#scenariosTable").fancyTable({
                sortColumn: 0,
                pagination: count > perPage,
                searchable: true,
                sortable: true,
                perPage: perPage,
                globalSearch: true
            });
        };
        _initTab('#tab-scenarios', action, dataCallback);
    }

    function _initParsers() {
        const action = 'parsers-list';
        const dataCallback = function (data) {
            const rows = [];
            let count = 0;
            const perPage = 10;
            data.parsers.map(function (row) {
                rows.push({
                    name: row.name,
                    status: row.status,
                    local_version: row.local_version || ' ',
                    local_path: row.local_path || ' ',
                    description: row.description || ' '
                });
            });
            let content = '';
            if (!rows.length) {
                content = default_result;
            }
            for (const line of rows) {
                content += '<tr>' +
                    '<td>' + line['name'] + '</td>' +
                    '<td>' + line['status'] + '</td>' +
                    '<td>' + line['local_version'] + '</td>' +
                    '<td>' + line['local_path'] + '</td>' +
                    '<td>' + line['description'] + '</td>' +
                    '</tr>';
                count++;
            }
            $('#tab-parsers table tbody').html(content);
            $("#parsersTable").fancyTable({
                sortColumn: 0,
                pagination: count > perPage,
                searchable: true,
                sortable: true,
                perPage: perPage,
                globalSearch: true
            });
        };
        _initTab('#tab-parsers ', action, dataCallback);
    }

    function _initPostoverflows() {
        const action = 'postoverflows-list';
        const dataCallback = function (data) {
            const rows = [];
            let count = 0;
            const perPage = 10;
            data.postoverflows.map(function (row) {
                rows.push({
                    name: row.name,
                    status: row.status,
                    local_version: row.local_version || ' ',
                    local_path: row.local_path || ' ',
                    description: row.description || ' '
                });
            });
            let content = '';
            if (!rows.length) {
                content = default_result;
            }
            for (const line of rows) {
                content += '<tr>' +
                    '<td>' + line['name'] + '</td>' +
                    '<td>' + line['status'] + '</td>' +
                    '<td>' + line['local_version'] + '</td>' +
                    '<td>' + line['local_path'] + '</td>' +
                    '<td>' + line['description'] + '</td>' +
                    '</tr>';
                count++;
            }
            $('#tab-postoverflows table tbody').html(content);
            $("#postoverflowsTable").fancyTable({
                sortColumn: 0,
                pagination: count > perPage,
                searchable: true,
                sortable: true,
                perPage: perPage,
                globalSearch: true
            });
        };
        _initTab('#tab-postoverflows ', action, dataCallback);
    }

    function _initBouncers() {
        const action = 'bouncers-list';
        const dataCallback = function (data) {
            const rows = [];
            let count = 0;
            const perPage = 10;
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
            let content = '';
            if (!rows.length) {
                content = default_result;
            }
            for (const line of rows) {
                content += '<tr>' +
                    '<td>' + line['name'] + '</td>' +
                    '<td>' + line['ip_address'] + '</td>' +
                    '<td>' + line['valid'] + '</td>' +
                    '<td>' + line['last_pull'] + '</td>' +
                    '<td>' + line['type'] + '</td>' +
                    '<td>' + line['version'] + '</td>' +
                    '</tr>';
                count++;
            }

            $('#tab-bouncers table tbody').html(content);
            $("#bouncersTable").fancyTable({
                sortColumn: 0,
                pagination: count > perPage,
                searchable: true,
                sortable: true,
                perPage: perPage,
                globalSearch: true
            });
        };
        _initTab('#tab-bouncers ', action, dataCallback);
    }

    function _initAlerts() {
        const action = 'alerts-list';
        const dataCallback = function (data) {
            const rows = [];
            let count = 0;
            const perPage = 10;
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
            let content = '';
            if (!rows.length) {
                content = default_result;
            }
            for (const line of rows) {
                content += '<tr>' +
                    '<td>' + line['id'] + '</td>' +
                    '<td>' + line['value'] + '</td>' +
                    '<td>' + line['reason'] + '</td>' +
                    '<td>' + line['country'] + '</td>' +
                    '<td>' + line['as'] + '</td>' +
                    '<td>' + line['decisions'] + '</td>' +
                    '<td>' + line['created_at'] + '</td>' +
                    '</tr>';
                count++;
            }

            $('#tab-alerts table tbody').html(content);
            $("#alertsTable").fancyTable({
                sortColumn: 0,
                pagination: count > perPage,
                searchable: true,
                sortable: true,
                perPage: perPage,
                globalSearch: true
            });
        };
        _initTab('#tab-alerts ', action, dataCallback);
    }

    function _initDecisions() {
        const action = 'decisions-list';
        const dataCallback = function (data) {
            const rows = [];
            const perPage = 10;
            let count = 0;
            data.map(function (row) {
                row.decisions.map(function (decision) {
                    // ignore deleted decisions
                    if (decision.duration.startsWith('-')) {
                        return;
                    }
                    rows.push({
                        // search will break on empty values when using .append(). so we use spaces
                        delete: _getDeleteButton(decision),
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
            let content = '';
            if (!rows.length) {
                content = default_result;
            }
            for (const line of rows) {
                content += '<tr class="row-decision-' + line['id'] + '">' +
                    '<td>' + line['delete'] + '</td>' +
                    '<td>' + line['id'] + '</td>' +
                    '<td>' + line['source'] + '</td>' +
                    '<td>' + line['scope_value'] + '</td>' +
                    '<td>' + line['reason'] + '</td>' +
                    '<td>' + line['action'] + '</td>' +
                    '<td>' + line['country'] + '</td>' +
                    '<td>' + line['as'] + '</td>' +
                    '<td>' + line['events_count'] + '</td>' +
                    '<td>' + line['expiration'] + '</td>' +
                    '<td>' + line['alert_id'] + '</td>' +
                    '</tr>';
                count++;
            }

            $('#tab-decisions table tbody').html(content);
            $("#decisionsTable").fancyTable({
                sortColumn: 0,
                pagination: count > perPage,
                searchable: true,
                sortable: true,
                perPage: perPage,
                globalSearch: true
            });

        };
        _initTab('#tab-decisions', action, dataCallback);
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
                        $('#decisionsTable .row-decision-' + decisionId).remove();
                    }
                }
            });
        });
    }

    function init() {
        // Machines tab is the first to be visible
        _initMachines();

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
    }

    return {
        deleteDecision: deleteDecision,
        init: init
    };
}());
