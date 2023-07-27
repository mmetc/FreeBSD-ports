<?php
/*
 * overview_decisions.php
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


$objects = json_decode(shell_exec("/usr/local/bin/cscli decisions list -l 0 -o json | sed 's/^null$/\[\]/'"), true);

$tableContent = '';
$count = 0;
$perPage = 10;

function startsWith( $haystack, $needle ) {
    $length = strlen( $needle );
    return substr( $haystack, 0, $length ) === $needle;
}

if ($objects) {
    foreach ($objects as $object) {

        $decisions = $object['decisions']??[];
        foreach ($decisions as $decision){
            // ignore deleted decisions
            if (empty($decision['duration']) || startsWith($decision['duration'], '-')) {
                continue;
            }
            $tableContent .= '<tr>
            <td>' . ($decision['id'] ?? '') . '</td>
            <td>' . ($decision['origin'] ?? '') . '</td>
            <td>' . ($decision['scope'] ?? '') . ':'. ($decision['value'] ?? ''). '</td>
            <td>' . ($decision['scenario'] ?? '') . '</td>
            <td>' . ($decision['type'] ?? '') . '</td>
            <td>' . ($object['source']['cn'] ?? '') . '</td>
            <td>' . ($object['source']['as_name'] ?? '') . '</td>
            <td>' . ($object['events_count'] ?? '') . '</td>
            <td>' . ($decision['duration'] ?? '') . '</td>
            <td>' . ($object['id'] ?? '') . '</td>
          </tr>' . PHP_EOL;
            $count++;
        }
    }
}
$pagination = $count > $perPage ? "true" : "false";
$content = <<<EOT
<script type="text/javascript">
    $("#decisionsTable").fancyTable({
      sortColumn: 0,
      pagination: $pagination,
      searchable: true,
      sortable:true,
      perPage: $perPage,
      globalSearch:true
    });
  </script>

<table id="decisionsTable" class="table table-striped crowdsecTable">
    <thead>
        <tr>
          <th data-sortas="numeric">ID</th>
          <th>Source</th>
          <th>Scope:Value</th>
          <th>Reason</th>
          <th>Action</th>
          <th>Country</th>
          <th>AS</th>
          <th>Events</th>
          <th>Expiration</th>
          <th data-sortas="numeric">Alert ID</th>
        </tr>
    </thead>
    <tbody>
        $tableContent
    </tbody>
</table>
EOT;

echo $content;


