/* Validate that the package.json follows the expected form */

// This is really the first test. If the tests fail here
// then there is likely a JSON formatting error in the file.
var pluginsList = require('../docs/plugins_list.json');

var chai = require('chai'),
    expect = chai.expect;

describe('in the json document', function() {
  // this hoists up so we can access it later in validation
  var mimes = []

  /* we start with mime_types because we need it to exist to validate plugins */
  it('a mime_types array must exist', function() {
    expect(pluginsList).to.have.property('mime_types').that.is.an('array');
  });

  describe('the top-level mime_types array', function() {
    mimes = pluginsList.mime_types;

    it('must not be empty', function() {
      expect(mimes).to.not.be.empty;
    });

    describe('must contain valid mime_types:', function() {
      for (let mime of mimes) {
        it(mime + ' should be a valid mime_type', function() {
          /* mime types in this context predate and may not conform to the
          whatwg mimesniff spec. It is unclear how to validate them. */
          expect(mime).to.include("/");
        });
      }
    });

  });

  it('a plugins object must exist', function() {
    expect(pluginsList).to.have.property('plugins').that.is.an('object');
  });

  describe('the top-level plugins object', function() {
    let plugins = pluginsList.plugins;

    it('must not be empty', function() {
      expect(plugins).to.not.be.empty;
    });

    describe('must contain valid plugins:', function() {
      for (let plugin_name in plugins) {
        let plugin_data = plugins[plugin_name];
        describe(plugin_name, function() {
          it('must be an object', function() {
            expect(plugin_data).to.be.an('object');
          });
          it('must have a display name', function() {
            expect(plugin_data.display_name).to.be.a('string');
          });
          it('must have a description', function() {
            expect(plugin_data.description).to.be.a('string');
          });
          it('must have some version(s)', function() {
            expect(plugin_data.versions).to.be.an('object');
          });
          for (let version_name in plugin_data.versions) {
            describe('version ' + version_name + ":", function() {
              let versions = plugin_data.versions[version_name];
              it('must be a known version', function() {
                expect(version_name).to.be.oneOf(["win", "mac", "lin", "all"]);
              });
              it('must have a latest version', function() {
                expect(versions.latest).to.be.an('array');
              });
              for (let v in versions.latest) {
                let version = versions.latest[v];
                describe('version ' + version.version + ":", function() {
                  it('must have a valid status', function() {
                    expect(version.status).to.be.oneOf(
                      ['latest', 'vulnerable']);
                  });
                  if (version.status === "vulnerable") {
                    it('must describe the vulnerability', function() {
                      expect(version.vulnerability_url).to.be.a('string');
                    });
                  }
                  it('must define an affected version', function() {
                    expect(version.version).to.be.a('string');
                    version_array = version.version.split('.');
                    expect(version_array).to.have.length.below(5);
                    for (let version_number in version_array) {
                      let n = Number(version_array[version_number]);
                      expect(n).to.be.a('Number');
                    }
                  });
                  it('must define a detection_type', function() {
                    expect(version.detection_type).to.be.a('string');
                  });
                  // most of the time version.os_name will agree with the parent
                  // os name, but not always so we don't assert that
                  // it('must agree with parent elements about os_name',);
                  it('must define a platform', function() {
                    expect(version).to.have.a.property('platform');
                    let p = version.platform;
                    expect(p).to.be.a('object');
                    expect(p.app_id).to.equal('*');
                    expect(p.app_release).to.equal('*');
                    // C DC for two versions of adobe
                    expect(p.app_version).to.oneOf(['*', 'Continuous DC'])
                    expect(p.locale).to.equal('*')
                  });
                });
              }
              for (let v in versions.vulnerable) {
                let version = versions.vulnerable[v];
                describe('version ' + version.version + ":", function() {
                  it('must have a valid status', function() {
                    expect(version.status).to.equal('vulnerable');
                  });
                  if (version.status === "vulnerable") {
                    it('must describe the vulnerability', function() {
                      expect(version.vulnerability_url).to.be.a('string');
                    });
                  }
                  it('must define an affected version', function() {
                    expect(version.version).to.be.a('string');
                    version_array = version.version.split('.');
                    expect(version_array).to.have.length.below(5);
                    for (let version_number in version_array) {
                      let n = Number(version_array[version_number]);
                      expect(n).to.be.a('Number');
                    }
                  });
                  it('must define a detection_type', function() {
                    expect(version.detection_type).to.be.a('string');
                  });
                  // most of the time version.os_name will agree with the parent
                  // os name, but not always so we don't assert that
                  // it('must agree with parent elements about os_name',);
                  it('must define a platform', function() {
                    expect(version).to.have.a.property('platform');
                    let p = version.platform;
                    expect(p).to.be.a('object');
                    expect(p.app_id).to.equal('*');
                    expect(p.app_release).to.oneOf(
                      ['*', 'Extended Release Version']);
                    // C DC for two versions of adobe
                    expect(p.app_version).to.oneOf(['*', 'Continuous DC'])
                    expect(p.locale).to.equal('*')
                  });
                });
              }
            });
          }
          it('must check for known mime types', function() {
            let plugin_mimes = plugin_data.mimes;
            expect(plugin_mimes).to.be.an('array');
            for (let mime in plugin_mimes) {
              // ensure they are in the top level mimes array
              expect(plugin_mimes[mime]).to.be.oneOf(mimes);
            }
          });
          it('must provide a url', function() {
            expect(plugin_data.url).to.be.a('string');
          });
          it('must provide a regex', function() {
            // todo: validate each regex
            expect(plugin_data.regex).to.be.an('array');
            for (let r in plugin_data.regex) {
              expect(plugin_data.regex[r]).to.be.a('string')
            }
          });
        });
      }
    });

  });
});
