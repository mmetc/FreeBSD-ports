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

$objects = json_decode(shell_exec("/usr/local/bin/cscli machines list -o json | sed 's/^null$/\[\]/'"), true);

$tableContent = '';
$count = 0;
$perPage = 10;

if($objects){
    foreach ($objects as $object)
    {
        $tableContent .= '<tr>
            <td>'.($object['machineId']??'').'</td>
            <td>'.($object['ipAddress']??'').'</td>
            <td>'.($object['updated_at']??'').'</td>
            <td>'.(!empty($object['isValidated']) ? 'Yes': 'No').'</td>
            <td>'.($object['version']??'').'</td>
          </tr>' . PHP_EOL;
        $count++;
    }
}

$pagination = $count > $perPage ? "true" : "false";

$content = <<<EOT
  <script type="text/javascript">
  events.push(function() {
    jQuery( "#tabs" ).tabs({
      beforeLoad: function( event, ui ) {
        ui.jqXHR.fail(function() {
          ui.panel.html(
            "Couldn't load this tab. We'll try to fix this as soon as possible." );
        });
      }
    });
    jQuery(document).ready(function() {
                    var s = document.createElement("script");
                    s.type = "text/javascript";
                    s.src = "/crowdsec/js/fancyTable.min.js";
                    // Use any selector
                    jQuery("head").append(s);
    });
    $("#machinesTable").fancyTable({
      sortColumn: 0,
      pagination: $pagination,
      searchable: true,
      sortable:true,
      perPage: $perPage,
      globalSearch:true
    });
  });
  </script>

<div id="tabs">
  <ul>
    <li><a href="#tabs-1">Machines</a></li>
    <li><a href="/crowdsec/overview_bouncers.php">Bouncers</a></li>
    <li><a href="/crowdsec/overview_collections.php">Collections</a></li>
    <li><a href="/crowdsec/overview_scenarios.php">Scenarios</a></li>
    <li><a href="/crowdsec/overview_parsers.php">Parsers</a></li>
    <li><a href="/crowdsec/overview_postoverflows.php">Postoverflows</a></li>
    <li><a href="/crowdsec/overview_alerts.php">Alerts</a></li>
    <li><a href="/crowdsec/overview_decisions.php">Decisions</a></li>
  </ul>
  <div id="tabs-1">
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
          $tableContent
        </tbody>
    </table>
  </div>
</div>
EOT;







echo $content;


include("foot.inc");

$after_footer = <<<EOT
 <script type="text/javascript" src="/crowdsec/js/fancyTable.min.js"></script>
EOT;

echo $after_footer;
