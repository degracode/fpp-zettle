var zettleConfig = null;

function SaveZettleConfig(config, button = '', reload = false, success_msg = '') {
  // var data = JSON.stringify(config);
  $.ajax({
    type: "POST",
    // url: 'api/configfile/plugin.fpp-zettle.json',
    url: 'plugin.php?plugin=fpp-zettle&page=zettle.php&command=update_json&nopage=1',
    async: false,
    data: config,
    dataType: 'json',
    async: false,
    beforeSend: function () {
      if (button != '') {
        $(button).prop('disabled', true);
      }
    },
    success: function (data) {
      $.jGrowl(success_msg, {
        themeState: 'success'
      });
      if (reload) {
        ;
        setTimeout(function () {
          location.reload();
        }, 3000);
      }
    },
    error: function () {
      if (button != '') {
        $(button).prop('disabled', false);
      }
      DialogError('Error', "ERROR: There was an error, please try again!");
    }
  });
}

function InstallDone() {
  $('#closeDialogButton').show();
}

function CloseInstallDialog() {
  $('#installPopup').fppDialog('close');
  location.reload();
}

function UpgradePlugin() {
  var url = 'api/plugin/fpp-zettle/upgrade?stream=true';

  $('#pluginsProgressPopup').fppDialog({
    width: 900,
    title: "Upgrade Plugin",
    dialogClass: 'no-close'
  });
  $('#pluginsProgressPopup').fppDialog("moveToTop");
  document.getElementById('pluginsText').value = '';
  StreamURL(url, 'pluginsText', 'PluginProgressDialogDone', 'PluginProgressDialogDone');
}

function PluginProgressDialogDone() {
  $('#closeDialogButton').show();
}

function ClosePluginProgressDialog() {
  $('#pluginsProgressPopup').fppDialog('close');
  location.reload(true);
}

$(function () {
  allowMultisyncCommands = true;

  if ($('#pluginupdate').length) {
    $.ajax({
      type: "POST",
      url: 'api/plugin/fpp-zettle/updates',
      dataType: 'json',
      contentType: 'application/json',
      success: function (data) {
        if (data.updatesAvailable) {
          $('#pluginupdate').show();
        }
      }
    });
  }

  $.get('api/configfile/plugin.fpp-zettle.json')
    .done(function (data) {
      processZettleConfig(data);
    })
    .fail(function (data) {
      processZettleConfig('[]');
    });

  function processZettleConfig(config) {
    if (typeof config === "string") {
      zettleConfig = $.parseJSON(config);
    } else {
      zettleConfig = config;
    }

    if ($('#api_effect').length > 0) {
      console.log('api_effect found');
      var newButtonRowCommand = 'button_TPL_Command';
      var newButtonRowTable = 'tableButtonTPL';

      LoadCommandList(newButtonRowCommand);
      PopulateExistingCommand(zettleConfig, newButtonRowCommand, newButtonRowTable, true);

      if (zettleConfig.command == 'Overlay Model Effect' && zettleConfig.args[2] == 'Text') {
        $('#text_options').show();
      }

      $('.buttonCommand').attr('id', newButtonRowCommand).on('change', function () {
        CommandSelectChanged(newButtonRowCommand, newButtonRowTable, true);

        $('#tableButtonTPL_arg_3_row').find('select').on('change', function () {
          if ($(this).val() == 'Text') {
            $('#text_options').fadeIn();
          } else {
            $('#text_options').fadeOut();
          }
        });
      });
    }
  }

  $('#setup').on('submit', function (e) {
    e.preventDefault();

    // Check if keys are valid
    $.ajax({
      type: "POST",
      url: 'plugin.php?plugin=fpp-zettle&page=zettle.php&command=check_keys&nopage=1',
      data: {
        client_id: $("#client_id").val(),
        client_secret: $("#client_secret").val(),
      },
      dataType: 'json',
      async: false,
      success: function (data) {
        var data = {
          option: "setup",
          client_id: $("#client_id").val(),
          client_secret: $("#client_secret").val(),
          organizationUuid: data.organizationUuid
        };
        // Save config
        SaveZettleConfig(data, '#save', true, 'Details Saved!');
      },
      error: function (xhr, ajaxOptions, thrownError) {
        DialogError('Signup Error', "ERROR: There seems to be a problem with your keys please check them and try again!");
      }
    });
  });

  $('#clear_config').on('click', function (e) {
    if (confirm('CLEAR CONFIG are you sure?')) {
      $.ajax({
        type: "GET",
        url: 'plugin.php?plugin=fpp-zettle&page=zettle.php&command=clear_config&nopage=1',
        dataType: 'json',
        async: false,
        data: {},
        processData: false,
        contentType: 'application/json',
        success: function (data) {
          $.jGrowl('Config Cleared!', {
            themeState: 'success'
          });
          setTimeout(function () {
            location.reload();
          }, 1000);
        }
      });
    }
  });

  $('#clear_subscription').on('click', function (e) {
    if (confirm('CLEAR SUBSCRIPTION are you sure?')) {
      $.ajax({
        type: "GET",
        url: 'plugin.php?plugin=fpp-zettle&page=zettle.php&command=clear_subscription&nopage=1',
        dataType: 'json',
        async: false,
        data: {},
        processData: false,
        contentType: 'application/json',
        success: function (data) {
          $.jGrowl(data.message, {
            themeState: 'success'
          });
          setTimeout(function () {
            location.reload();
          }, 1000);
        }
      });
    }
  });

  $('#status').on('click', function () {
    window.location.href = "plugin.php?_menu=status&plugin=fpp-zettle&page=status.php";
  });

  $('#clear_transactions').on('click', function (e) {
    var transactions = [];
    //plugin.php?plugin=fpp-zettle&page=zettle.php&command=update_json&nopage=1
    $.ajax({
      type: "POST",
      url: 'plugin.php?plugin=fpp-zettle&page=zettle.php&command=clear_transactions&nopage=1',
      dataType: 'json',
      async: false,
      data: JSON.stringify(transactions),
      processData: false,
      contentType: 'application/json',
      success: function (data) {
        $.jGrowl('Transactions cleared', {
          themeState: 'success'
        });
        setTimeout(function () {
          location.reload();
        }, 3000);
      },
      error: function () {
        $('#save').prop('disabled', false);
        DialogError('Error', "ERROR: There was an error in saving your details, please try again!");
      }
    });
  });

  $('#subscription').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      type: "GET",
      url: 'plugin.php?plugin=fpp-zettle&page=zettle.php&command=get_org_id&nopage=1',
      dataType: 'json',
      async: false,
      data: {},
      processData: false,
      contentType: 'application/json',
      success: function (data) {
        var subscription_data = {
          uuid: $('#uuid').val(),
          organizationUuid: data.organizationUuid,
          destination: $('#destination').val(),
          contactEmail: $('#contactEmail').val()
        };
        if ($('#password').length) {
          subscription_data.password = $('#password').val();
        }
        $.ajax({
          type: "POST",
          url: 'plugin.php?plugin=fpp-zettle&page=zettle.php&command=create_subscription&nopage=1',
          dataType: 'json',
          async: false,
          data: subscription_data,
          success: function (data) {
            if (data.error) {
              $.jGrowl('Error: ' + data.message, {
                themeState: 'danger'
              });
            } else {
              $.jGrowl(data.message, {
                themeState: 'success'
              });
              setTimeout(function () {
                location.reload();
              }, 3000);
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            DialogError('create_subscription Error', "ERROR: Error Please Try Again");
          }
        });
      },
      error: function (xhr, ajaxOptions, thrownError) {
        DialogError('get_org_id Error', "ERROR: There was an error getting get_org_id");
      }
    });
  });

  $('#update_subscription').on('submit', function (e) {
    e.preventDefault();
    var subscription_data = {
      organization_uuid: $('#organization_uuid').val(),
      subscription_uuid: $('#subscription_uuid').val(),
      destination: $('#destination').val(),
      contactEmail: $('#contactEmail').val()
    };

    $.ajax({
      type: "POST",
      url: 'plugin.php?plugin=fpp-zettle&page=zettle.php&command=update_subscription&nopage=1',
      dataType: 'json',
      async: false,
      data: subscription_data,
      success: function (data) {
        if (data.error) {
          $.jGrowl('Error: ' + data.message, {
            themeState: 'danger'
          });
        } else {
          $.jGrowl(data.message, {
            themeState: 'success'
          });
          setTimeout(function () {
            location.reload();
          }, 3000);
        }
      }
    });
  });

  $('#api_effect').on('submit', function (e) {
    e.preventDefault();

    var effect = $('#select_effect option:selected').val();

    $('[id^="tableButton"]').each(function () {
      var oldId = $(this).prop('id')
      var idArr = oldId.split('_');
      idArr[0] = 'tableButtonTPL'
      $(this).attr('id', idArr.join('_'));
      console.log($(this).attr('id', idArr.join('_')));
    });

    var zettle = {
      "option": 'effect',
      "effect_activate": $('#effect_activate option:selected').val(),
    };
    CommandToJSON('button_TPL_Command', 'tableButtonTPL', zettle);
    SaveZettleConfig(zettle, '#effect_save', true, 'Effect Saved!');
  });
  // Test command with out the need to save it first
  $('#test_command').on('click', function () {
    // Check for command
    if (zettleConfig.command == '') {
      // Display error to user if command not found
      DialogError('Error', 'No command found, please select a command!');
    } else {
      var url = "api/command/";
      var data = {};
      // Get command data
      CommandToJSON('button_TPL_Command', 'tableButtonTPL', data);
      // Build url with selected command
      url += data['command'];
      // Send ajax to test command to see if user likes it before they save it
      $.ajax({
        type: "POST",
        url: url,
        dataType: 'text',
        async: false,
        data: JSON.stringify(data['args']),
        processData: false,
        contentType: 'application/json',
        success: function (data) {
          if (data != '') {
            $.jGrowl('Test Sent!', {
              themeState: 'success'
            });
            $.jGrowl('If you like what you see don\'t forget to save it!!', {
              themeState: 'success',
              life: 5000
            });
          }
        }
      });
    }
  });

  $('#install').on('submit', function (e) {
    e.preventDefault();

    $('#closeDialogButton').hide();
    $('#installPopup').fppDialog({
      height: 600,
      width: 900,
      title: "Install Dataplicity",
      dialogClass: 'no-close'
    });
    $('#installPopup').fppDialog("moveToTop");
    $('#installText').html('');

    var command = $('#command').val();

    StreamURL('plugin.php?plugin=fpp-zettle&page=install-dataplicity.php&nopage=1&command=' + command, 'installText', 'InstallDone');
  });

  $('#pushover').on('submit', function (e) {
    e.preventDefault();

    var thisForm = $(this);
    var submitButton = $("input[type=submit]", thisForm);

    $.ajax({
      type: "POST",
      url: "plugin.php?plugin=fpp-zettle&page=zettle.php&command=save_pushover&nopage=1",
      dataType: 'json',
      async: false,
      data: {
        option: "pusher",
        activate: $('#pushover_activate option:selected').val(),
        app_token: $('#pushover_app_token').val(),
        user_key: $('#pushover_user_key').val(),
        message: $('#pushover_message').val()
      },
      beforeSend: function () {
        $(submitButton).prop('disabled', true);
      },
      success: function (data) {
        $.jGrowl(data.message, {
          themeState: "success"
        });
        setTimeout(function () {
          location.reload();
        }, 3000);
      }
    });
  });

  $('#publish').on('submit', function (e) {
    e.preventDefault();

    var thisForm = $(this);
    var submitButton = $("input[type=submit]", thisForm);

    $.ajax({
      type: "POST",
      url: "plugin.php?plugin=fpp-zettle&page=zettle.php&command=save_publish&nopage=1",
      dataType: 'json',
      async: false,
      data: {
        option: "publish",
        activate: $('#publish_activate option:selected').val(),
        //location: $('#publish_location').val(),
      },
      beforeSend: function () {
        $(submitButton).prop('disabled', true);
      },
      success: function (data) {
        $.jGrowl(data.message, {
          themeState: "success"
        });
        setTimeout(function () {
          location.reload();
        }, 3000);
      }
    });
  });
});
