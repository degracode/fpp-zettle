<?php

include_once 'zettle.common.php';
$pluginName = 'zettle';
$pluginJson = convertAndGetSettings($pluginName);
?>
<div id="global" class="settings">
    <legend>Zettle Setup</legend>
    <p>Add your client id and secret generated from the Zettle Integrations
        webpage</p>
    <script>
        $(function() {
            var zettleConfigJsonData = '<?php echo json_encode($pluginJson); ?>';
            var zettleConfigData = JSON.parse(zettleConfigJsonData);
            var pluginName = '<?php echo $pluginName; ?>';

            $('#setup').on('submit', function(e) {
                e.preventDefault();

                var client_id = $("#client_id").val();
                var client_secret = $("#client_secret").val();

                var zettleConfig = {
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "organizationUuid": zettleConfigData.organizationUuid,
                    "subscriptions": zettleConfigData.subscriptions
                };

                $.ajax({
                    type: "POST",
                    url: 'fppjson.php?command=setPluginJSON&plugin=fpp-'+pluginName,
                    dataType: 'json',
                    async: false,
                    data: JSON.stringify(zettleConfig),
                    processData: false,
                    contentType: 'application/json',
                    beforeSend: function() {
                        $('#save').prop('disabled', true);
                    },
                    success: function(data) {
                        $.jGrowl('Details saved', {
                            themeState: 'success'
                        });
                        setTimeout(function() {
                            //window.location.href = "plugin.php?_menu=content&plugin=fpp-zettle&page=create-subscription.php";
                            location.reload();
                        }, 3000);
                    },
                    error: function() {
                        $('#save').prop('disabled', false);
                        DialogError('Error', "ERROR: There was an error in saving your details, please try again!");
                    }
                });
            });

            $('#createSubscriptions').on('click', function() {
                window.location.href = "plugin.php?_menu=content&plugin=fpp-" + pluginName + "&page=create-subscription.php";
            });

            $('#clear_config').on('click', function(e) {
                if (confirm('CLEAR CONFIG are you sure?')) {
                    var blankConfig = {
                        "client_id": "",
                        "client_secret": "",
                        "organizationUuid": "",
                        "subscriptions": []
                    };
                    var blackTransactions = <?php echo json_encode([]); ?>;
                    $.ajax({
                        type: "GET",
                        url: 'plugin.php?plugin=fpp-' + pluginName + '&page=zettle.php&command=delete_subscription&nopage=1',
                        dataType: 'json',
                        async: false,
                        data: {},
                        processData: false,
                        contentType: 'application/json',
                        success: function(data) {
                            $.ajax({
                                type: "POST",
                                url: 'fppjson.php?command=setPluginJSON&plugin=fpp-'+pluginName,
                                dataType: 'json',
                                async: false,
                                data: JSON.stringify(blankConfig),
                                processData: false,
                                contentType: 'application/json',
                                success: function(data) {
                                    $.jGrowl('Config Cleared!', {
                                        themeState: 'success'
                                    });
                                },
                                error: function() {
                                    DialogError('Error', "ERROR: Cound not clear config");
                                }
                            });
                            $.ajax({
                                type: "POST",
                                url: 'fppjson.php?command=setPluginJSON&plugin=fpp-' + pluginName + '-transactions',
                                dataType: 'json',
                                async: false,
                                data: JSON.stringify(blackTransactions),
                                processData: false,
                                contentType: 'application/json',
                                success: function(data) {
                                    $.jGrowl('Transactions Cleared!', {
                                        themeState: 'success'
                                    });
                                },
                                error: function() {
                                    DialogError('Error', "ERROR: Cound not clear transactions");
                                }
                            });

                            setTimeout(function () {
                                location.reload();
                            }, 1000);
                        }
                    });
                }
            });
        });
    </script>
    <div class="row">
        <form id="setup" action="" method="post">
            <div class="col-auto mr-auto">
                <div class="row">
                    <div class="col-auto">
                        Client Id: &nbsp;<input type='text' id='client_id'
                            name='client_id'
                            value='<?php echo $pluginJson["client_id"] ?>'
                            required></input>
                    </div>
                    <div class="col-auto">
                        Client Secret: &nbsp;<input type='password'
                            id='client_secret' name='client_secret'
                            value='<?php echo $pluginJson["client_secret"] ?>'
                            required></input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-auto">
                        <input id="save" type="submit" value="Save"
                            class="buttons btn-success"">
                        <?php if ($pluginJson['client_id'] != '' && count($pluginJson['subscriptions']) == 0) { ?>
                        <input id="createSubscriptions" type="button" value="Create Subscription" class="buttons">
                        <input id="clear_config" type="button" class="buttons" value="Clear Config">
                        <?php } ?>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
