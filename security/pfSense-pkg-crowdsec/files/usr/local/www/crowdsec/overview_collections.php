<?php
/*
 * overview_collections.php
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


$objects = json_decode(shell_exec("/usr/local/bin/cscli collections list -o json"), true);

$tableContent = '';

if ($objects) {
    $objects = $objects['collections']??[];
    foreach ($objects as $object) {
        $tableContent .= '<tr>
            <td>' . ($object['name'] ?? '') . '</td>
            <td>' . ($object['status'] ?? '') . '</td>
            <td>' . ($object['local_version'] ?? '') . '</td>
            <td>' . ($object['local_path'] ?? '') . '</td>
          </tr>' . PHP_EOL;
    }
}

$content = <<<EOT
<script type="text/javascript">
    $("#collectionsTable").fancyTable({
      sortColumn: 0,
      pagination: true,
      searchable: true,
      sortable:true,
      perPage: 10,
      globalSearch:true
    });
  </script>

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
        $tableContent
    </tbody>
</table>
EOT;

echo $content;


