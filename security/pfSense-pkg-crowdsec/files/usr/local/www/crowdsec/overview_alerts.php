<?php
/*
 * overview_alerts.php
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

function getDecisionsByType($decisions)
{
    $dectypes = [];
    if (!$decisions) {
        return '';
    }

    foreach ($decisions as $decision) {
        $dectypes[$decision['type']] = isset($dectypes[$decision['type']]) ? $dectypes[$decision['type']] + 1 : 1;
    }

    $ret = '';
    foreach ($dectypes as $type => $count) {
        if ($ret !== '') {
            $ret .= ' ';
        }
        $ret .= ($type . ':' . $count);
    }

    return $ret;
}

$objects = json_decode(shell_exec("/usr/local/bin/cscli alerts list -l 0 -o json | sed 's/^null$/\[\]/'"), true);

$tableContent = '';

if ($objects) {
    foreach ($objects as $object) {
        $value = ($object['source']['scope'] ?? '') .
                 (!empty($object['source']['value']) ? ': ' . $object['source']['value'] : '');

        $tableContent .= '<tr>
            <td>' . ($object['id'] ?? '') . '</td>
            <td>' . $value . '</td>
            <td>' . ($object['scenario'] ?? '') . '</td>
            <td>' . ($object['source']['cn'] ?? '') . '</td>
            <td>' . ($object['source']['as_name'] ?? '') . '</td>
            <td>'. getDecisionsByType($object['decisions']) .'</td>
            <td>' . ($object['created_at'] ?? '') . '</td>
          </tr>' . PHP_EOL;
    }
}

$content = <<<EOT
<script type="text/javascript">
    $("#alertsTable").fancyTable({
      sortColumn: 0,
      pagination: true,
      searchable: true,
      sortable:true,
      perPage: 10,
      globalSearch:true
    });
  </script>

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
        $tableContent
    </tbody>
</table>
EOT;

echo $content;


