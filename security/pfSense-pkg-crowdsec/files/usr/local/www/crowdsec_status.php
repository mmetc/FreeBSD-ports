<?php
/*
 * crowdsec_status.php
 *
 * part of pfSense (https://www.pfsense.org)
 * Copyright (c) 2020-2023 Crowdsec
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

require_once("guiconfig.inc");
require_once("globals.inc");


$g['disablehelpicon'] = true;

$pgtitle = array(gettext("Security"), gettext("CrowdSec"), gettext("Status"));
$pglinks = ['@self', '@self', '@self'];
$shortcut_section = "crowdsec";

include("head.inc");

$tab_array = array();
$tab_array[] = array("Read me", false, "/crowdsec_landing.php");
$tab_array[] = array("Settings", false, "/pkg_edit.php?xml=crowdsec.xml&amp;id=0");
$tab_array[] = array("Status", true, "/crowdsec_status.php");
display_top_tabs($tab_array);




$content = <<<EOT
  <script src="/crowdsec/js/fancyTable.min.js" defer></script>
  <script src="/crowdsec/js/status.js" defer></script>
    <script>
    
    events.push(function() {
         CrowdSec.init();
    });
    </script>

<div id="tabs">
  <ul>
    <li><a href="#tab-machines">Machines</a></li>
    <li><a href="#tab-bouncers">Bouncers</a></li>
    <li><a href="#tab-collections">Collections</a></li>
    <li><a href="#tab-scenarios">Scenarios</a></li>
    <li><a href="#tab-parsers">Parsers</a></li>
    <li><a href="#tab-postoverflows">Postoverflows</a></li>
    <li><a href="#tab-alerts">Alerts</a></li>
    <li><a href="#tab-decisions">Decisions</a></li>
  </ul>
  <div id="tab-machines">
    <table id="machinesTable" class="table table-striped crowdsecTable">
        <thead>
            <tr>
              <th>Name</th>
              <th>IP Address</th>
              <th data-sortas="datetime">Last Update</th>
              <th>Validated?</th>
              <th>Version</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
  </div>
  <div id="tab-bouncers">
    <table id="bouncersTable" class="table table-striped crowdsecTable">
        <thead>
            <tr>
              <th>Name</th>
              <th>IP Address</th>
              <th>Valid</th>
              <th data-sortas="datetime">Last API Pull</th>
              <th>Type</th>
              <th>Version</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
  </div>
  <div id="tab-collections">
    <table id="collectionsTable" class="table table-striped crowdsecTable">
        <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Version</th>
              <th>Local Path</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
  </div>
  <div id="tab-scenarios">
      <table id="scenariosTable" class="table table-striped crowdsecTable">
        <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Version</th>
              <th>Path</th>
              <th>Description</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
  </div>
  <div id="tab-parsers">
      <table id="parsersTable" class="table table-striped crowdsecTable">
        <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Version</th>
              <th>Path</th>
              <th>Description</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
  </div>
  <div id="tab-postoverflows">
      <table id="postoverflowsTable" class="table table-striped crowdsecTable">
        <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Version</th>
              <th>Path</th>
              <th>Description</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
  </div>
  <div id="tab-alerts">
    <table id="alertsTable" class="table table-striped crowdsecTable">
        <thead>
            <tr>
              <th data-sortas="numeric">ID</th>
              <th>Value</th>
              <th>Reason</th>
              <th>Country</th>
              <th>AS</th>
              <th>Decisions</th>
              <th data-sortas="datetime">Created At</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
  </div>
  <div id="tab-decisions">
    <table id="decisionsTable" class="table table-striped crowdsecTable">
        <thead>
            <tr>
              <th></th>
              <th data-sortas="numeric">ID</th>
              <th>Source</th>
              <th>Scope:Value</th>
              <th>Reason</th>
              <th>Action</th>
              <th>Country</th>
              <th>AS</th>
              <th>Events</th>
              <th>Expiration</th>
              <th data-sortas="numeric">Alert&nbsp;ID</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
  </div>
</div>
<!-- Modal popup to confirm decision deletion -->
<div class="modal fade" id="delete-decision-modal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <h4 class="modal-title" id="modalLabel">Modal Title</h4>
            </div>
            <div class="modal-body">
                Modal content...
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">No, cancel</button>
                <button type="button" class="btn btn-danger" data-dismiss="modal" id="delete-decision-confirm">Yes, 
                delete</button>
            </div>
        </div>
    </div>
</div>
EOT;


echo $content;


include("foot.inc");
