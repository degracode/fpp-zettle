<?php
include_once 'zettle.common.php';
$pluginName = 'zettle';

$pluginJson = convertAndGetSettings($pluginName);

if (count($pluginJson['subscriptions']) > 0) {
    echo '<p class="mb-0">Subscription has been set up nothing to do here. Go to <a href="plugin.php?_menu=status&plugin=fpp-' . $pluginName . '&page=status.php">status page</a></p>';
} else { ?>
<script type="text/javascript" src="/plugin.php?plugin=fpp-zettle&file=zettle.js&nopage=1"></script>
<div id="global" class="settings">
  <legend>Create Subscription</legend>
    <div class="callout callout-warning">
      <h4>Warning:</h4>
    </div>

    <form id="subscription" action="" method="post">
    <div class="container-fluid settingsTable settingsGroupTable">
      <div class="row">
        <div class="printSettingLabelCol col-md-4 col-lg-3 col-xxxl-2">
          <div class="description">
            <i class="fas fa-fw fa-nbsp ui-level-0"></i>Destination
          </div>
        </div>
        <div class="printSettingFieldCol col-md">
          <input type='text' id='destination' value="<?php echo 'https://'.$_SERVER['HTTP_HOST'].'/api/plugin/fpp-zettle/event'; ?>" required>
          <img id='HostName_img' title='This is the url that zettle will talk to' src='images/redesign/help-icon.svg' class='icon-help'>
          <span id='HostName_tip' class='tooltip' style='display: none'>This is the url that zettle will talk to</span>
        </div>
      </div>
      <div class="row">
        <div class="printSettingLabelCol col-md-4 col-lg-3 col-xxxl-2">
          <div class="description">
            <i class="fas fa-fw fa-nbsp ui-level-0"></i>Contact Email
          </div>
        </div>
        <div class="printSettingFieldCol col-md">
          <input type='email' id='contactEmail' value="" required>
          <img id='contactEmail_img' title='Used if there is an error' src='images/redesign/help-icon.svg' class='icon-help'>
          <span id='contactEmail_tip' class='tooltip' style='display: none'>Used if there is an error</span>
        </div>
      </div>
    </div>
    <input id="save" type="submit" value="Save" class="buttons btn-success">
    <input id="status" type="button" value="Back To Status Page" class="buttons">
  </form>
</div>
<?php }
