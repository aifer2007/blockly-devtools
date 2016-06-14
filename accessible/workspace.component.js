/**
 * AccessibleBlockly
 *
 * Copyright 2016 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Angular2 Component that details how a Blockly.Workspace is
 * rendered in AccessibleBlockly.
 * @author madeeha@google.com (Madeeha Ghori)
 */

blocklyApp.WorkspaceComponent = ng.core
  .Component({
    selector: 'blockly-workspace',
    template: `
    <label>
      <h3 #workspaceTitle id="blockly-workspace-title">{{'WORKSPACE'|translate}}</h3>
    </label>

    <div id="blockly-workspace-toolbar" (keydown)="onWorkspaceToolbarKeypress($event)">
      <span *ngFor="#buttonConfig of toolbarButtonConfig">
        <button (click)="buttonConfig.action()" class="blocklyTree">
          {{buttonConfig.text}}
        </button>
      </span>
      <button id="clear-workspace" (click)="clearWorkspace()"
              [disabled]="isWorkspaceEmpty()" class="blocklyTree">
        {{'CLEAR_WORKSPACE'|translate}}
      </button>
    </div>

    <div *ngIf="workspace">
      <ol #tree *ngFor="#block of workspace.topBlocks_; #i = index"
          tabIndex="0" role="group" class="blocklyTree"
          [attr.aria-labelledby]="workspaceTitle.id"
          (keydown)="onKeypress($event, tree)">
        <blockly-workspace-tree [level]=1 [block]="block" [tree]="tree">
        </blockly-workspace-tree>
      </ol>
    </div>
    `,
    directives: [blocklyApp.WorkspaceTreeComponent],
    pipes: [blocklyApp.TranslatePipe]
  })
  .Class({
    constructor: [blocklyApp.TreeService, function(_treeService) {
      // ACCESSIBLE_GLOBALS is a global variable defined by the containing
      // page. It should contain a key, toolbarButtonConfig, whose
      // corresponding value is an Array with two keys: 'text' and 'action'.
      // The first is the text to display on the button, and the second is the
      // function that gets run when the button is clicked.
      this.toolbarButtonConfig =
          ACCESSIBLE_GLOBALS && ACCESSIBLE_GLOBALS.toolbarButtonConfig ?
          ACCESSIBLE_GLOBALS.toolbarButtonConfig : [];
      this.workspace = blocklyApp.workspace;
      this.treeService = _treeService;
    }],
    clearWorkspace: function() {
      this.workspace.clear();
      this.treeService.initTreeRegistry();
    },
    onWorkspaceToolbarKeypress: function(event) {
      this.treeService.onWorkspaceToolbarKeypress(
          event, document.activeElement.id);
    },
    onKeypress: function(event, tree){
      this.treeService.onKeypress(event, tree);
    },
    isWorkspaceEmpty: function() {
      return !this.workspace.topBlocks_.length;
    }
  });