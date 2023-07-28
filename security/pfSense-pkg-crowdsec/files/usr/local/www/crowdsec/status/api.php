<?php
/*
 * api.php
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
require_once("util.inc");
require_once("globals.inc");

$default = '[]';
$method = $_SERVER['REQUEST_METHOD'] ?? '';
if ($method === 'DELETE' && isset($_GET['action']) && isset($_GET['decision_id'])) {
    $id = strip_tags($_GET['decision_id']);
    $action = strip_tags($_GET['action']);
    if (!empty($id) && $action === 'decision-delete') {
        $ret = mwexec("/usr/local/bin/cscli --error decisions delete --id $id");
        if ($ret === 0){
            echo json_encode(['message' => 'OK']);
        }
        else {
            echo $default;
        }

    } else {
        echo $default;
    }
} elseif ($method === 'POST' && isset($_POST['action'])) {
    $action = strip_tags($_POST['action']);

    switch ($action) {
        case 'alerts-list':
            echo shell_exec("/usr/local/bin/cscli alerts list -l 0 -o json | sed 's/^null$/\[\]/'");
            break;
        case 'bouncers-list':
            echo shell_exec("/usr/local/bin/cscli bouncers list -o json | sed 's/^null$/\[\]/'");
            break;
        case 'collections-list':
            echo shell_exec("/usr/local/bin/cscli collections list -o json");
            break;
        case 'decisions-list':
            echo shell_exec("/usr/local/bin/cscli decisions list -l 0 -o json | sed 's/^null$/\[\]/'");
            break;
        case 'decision-delete':
            $id = strip_tags($_POST['decision_id']);
            if (!empty($id)) {
                echo shell_exec("/usr/local/bin/cscli --error decisions delete --id $id 2>&1");
            } else {
                echo $default;
            }
            break;
        case 'machines-list':
            echo shell_exec("/usr/local/bin/cscli machines list -o json | sed 's/^null$/\[\]/'");
            break;
        case 'parsers-list':
            echo shell_exec("/usr/local/bin/cscli parsers list -o json");
            break;
        case 'postoverflows-list':
            echo shell_exec("/usr/local/bin/cscli postoverflows list -o json");
            break;
        case 'scenarios-list':
            echo shell_exec("/usr/local/bin/cscli scenarios list -o json");
            break;
        default;
            echo $default;
    }
} else {
    echo $default;
}


