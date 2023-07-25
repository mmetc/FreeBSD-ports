Enable log processor -> enabled?
       service crowdsec enabled
       service crowdsec start

       disabled?
       service crowdsec stop
       service crowdsec disabled

Enable firewall bouncer -> enabled?
       service_firewall crowdsec enabled
       service_firewall crowdsec start

       disabled?
       service_firewall crowdsec stop
       service_firewall crowdsec disabled



when the form is saved

 set /usr/local/etc/crowdsec/local_api_credentials.yaml:url 
 set /usr/local/etc/crowdsec/config.yaml:api.server.listen_uri
 set /usr/local/etc/crowdsec/bouncers/crowdsec-firewall-bouncer.yaml:api_url


metrics port: 6060 by default, sets config.yaml:prometheus.listen_port



General settings: we can split in 

  Log processor (Crowdsec Agent)
    enable log processor
    metrics port  6060
    log level for crowdsec.log:  debug/info/warning

  Remediation component
    enable firewall bouncer
    log level for crowdsec-firewall-bouncer.log: debug/info/warning

  Security Engine (LAPI)
    LAPI port
    LAPI host

    LAPI is remote [x]
      Agent user
      Agent password
      Firewall bouncer API api_key


---------------------------

Replace "cp -r ./" by "${COPYTREE_SHARE} ." in Makefile ()



 - remove the alias and rules when the plugin is uninstalled => Done
 - possibly validation of tags or free-style strings in user settings
 - crowdsec -> CrowdSec => Done



YAML
 1 - embed/vendor (possibly version issues with php)
 2 - use composer as dependency (we have no way to cleanly uninstall yaml)

 3 - use an alternative yaml package (may be easier to integrate, but less popular, less security vetting whatever)

 4 - use yaml package of another language that comes as *.pkg (python has it)   python3, devel/py-yaml as deps - problem solved


what do we do with yaml?
 - configure lapi listen address, port
 - configure crowdsec_blacklists, crowdse6_blacklists
 - ... acquisition probably not


at install time, we also install collections and stuff
  pfsense equivalent of https://docs.opnsense.org/development/backend/autorun.html
  this needs to be in a shell script run at boot or when the plugin is installed
  cscli collections install crowdsecurity/pfsense (we can install crowdsecurity/opnsense right now)



 - see if other plugins are shipping cron files




------------------------



 rule Settings
    log: bool
    tag: words
    direction: in, out, any

--------------------------

 - YAML: if we can install the extension as dependency, something like https://freebsd.pkgs.org/12/freebsd-amd64/php80-pear-YAML-1.0.6.pkg.html
 - move page in Services
   at least landing tab with lorem ispum and links to crowdsec docs, console, discord/reddit/twitter
      and a few how-to paragraphs
   second tab with status/overview
      it will likely need to call cscli to gather information
 - dynamic active/unactive widgets with enable check (see teelgraf plugin) => DONE
 - automate alias creation crowdsec_blacklist, crowdsec6_blacklist




------------------------------------------

 - enable crowdsec
 - enable crowdsec_firewall
 - register agent (local [pfsense] or remote LAPI [linux])
 - register bouncer (local [pfsense] or remote LAPI [linux])

