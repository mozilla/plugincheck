/* Validate that the package.json follows the expected form */

// This is really the first test. If the tests fail here
// then there is likely a JSON formatting error in the file.
var pluginsList = require('../static/plugins_list.json');

var chai = require('chai'),
    expect = chai.expect;

describe('the json document', function() {
  it('should have a plugins object', function() {
    expect(pluginsList).to.have.property('plugins').that.is.an('object');
  });

  describe('the top-level plugins object', function() {
    let plugins = pluginsList.plugins;

    it('should not be empty', function() {
      expect(plugins).to.not.be.empty;
    });

    describe('each plugin should validate', function() {
      for (let plugin_name in plugins) {
        let plugin_data = plugins[plugin_name];
        it(plugin_name + ' should have a valid payload', function() {
          // validate plugin
          expect(plugin_data).to.be.an('object');
        });
      }
    });

  });


  it('should have a mime_types array', function() {
    expect(pluginsList).to.have.property('mime_types').that.is.an('array');
  });

  describe('the top-level mime_types array', function() {
    let mimes = pluginsList.mime_types;

    it('should not be empty', function() {
      expect(mimes).to.not.be.empty;
    });

    describe('each mime_type entry should validate', function() {
      for (let mime of mimes) {
        it(mime + ' should be a valid mime_type', function() {
          expect(mime).to.be.ok; // todo: actually validate
        });
      }
    });

  });
});

/*

{
  plugins: {
    :plugin_name : {
      display_name: "",
      description: "",
      versions: {
        :os || all: {
          latest: [
            {
             "status":"latest",
             "version":"0.0.0",
             "detected_version":"0.0.0",
             "detection_type":"original",
              "os_name":"*",
              "platform":{
                "app_id":"*",
                "app_release":"*",
                "app_version":"*",
                "locale":"*"
              }
            }
          ],
          vulnerable: [ ... ]
        }
      },
      mimes: [ :mime_types ],
      url: "",
      regex: [ :reges_str ]
    }
  },
  mime_types: []
}
*/
