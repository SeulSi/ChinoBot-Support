module.exports = {

    //---------------------------------------------------------------------
    // Action Name
    //
    // This is the name of the action displayed in the editor.
    //---------------------------------------------------------------------

    name: "Run SQL Query",

    //---------------------------------------------------------------------
    // Action Section
    //
    // This is the section the action will fall into.
    //---------------------------------------------------------------------

    section: "Other Stuff",

	//---------------------------------------------------------------------
	// DBM Mods Manager Variables 
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "General Wrex",

	// The version of the mod (Defaults to 1.0.0)
	version: "1.0.0",

    // A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "Runs SQL Queries",

	// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
	// {name:'WrexMods',path:'aaa_wrexmods_dependencies_MOD.js'}
	depends_on_mods: [
		{name:'WrexMODS',path:'aaa_wrexmods_dependencies_MOD.js'}
	],


	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, 'Unknown']);
	},

    //---------------------------------------------------------------------
    // Action Subtitle
    //
    // This function generates the subtitle displayed next to the name.
    //---------------------------------------------------------------------

    subtitle: function (data) {
        return `Query: ${data.query}`;
    },

    //---------------------------------------------------------------------
    // Action Fields
    //
    // These are the fields for the action. These fields are customized
    // by creating elements with corresponding IDs in the HTML. These
    // are also the names of the fields stored in the action's JSON data.
    //---------------------------------------------------------------------

    fields: ["storage", "varName", "hostname", "port", "username", "password", "database", "query", "otype", "debugMode"],

    //---------------------------------------------------------------------
    // Command HTML
    //
    // This function returns a string containing the HTML used for
    // editting actions. 
    //
    // The "isEvent" parameter will be true if this action is being used
    // for an event. Due to their nature, events lack certain information, 
    // so edit the HTML to reflect this.
    //
    // The "data" parameter stores constants for select elements to use. 
    // Each is an array: index 0 for commands, index 1 for events.
    // The names are: sendTargets, members, roles, channels, 
    //                messages, servers, variables
    //---------------------------------------------------------------------

    html: function (isEvent, data) {
        return `
	<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
	<div>
	  <p>
		<u><span class="wrexlink" data-url="https://github.com/Discord-Bot-Maker-Mods/DBM-Mods">Mod Info:</span></u><br>
		Created by <b>${this.author}</b><br><br>
	  </p>
	</div>	
		  <div class="ui toggle checkbox" >
			 <input type="checkbox" name="public" id="toggleAuth" onclick='document.getElementById("authSection").style.display = this.checked  ? "" : "none";'>
			 <label><font color="white">Show Connection Options</font></label>		
			 <text style="font-size: 60%;">Show/Hide Connection Options</text>
		  </div>
		  <div id="authSection" style="display: none; ">
			 <br> 
		  <p> <font color="white" style="font-size: 80%;" >
			 
		  </font></p>
		<div class="ui inverted column stackable center">
		<div class="four wide column"></div>
		 <form class="ui six wide column form segment">
			<div class="ui form">
			  <div class="two fields">
				<div class="field">
				 <label>Type</label>
				  <select id="otype" class="ui search dropdown round">
					<option value="0" selected>mysql</option>
					<option value="1">postgres</option>
					<option value="2">mssql</option>
					<option value="3">sqlite</option>
				  </select>
				</div>
			   </div>
			  <div id="auth">
				  <div class="two fields">
					<div class="field">
					  <label>Host</label>
					  <input  id="hostname" placeholder="localhost" type="text">
					</div>
					<div class="field">
					  <label>Port</label>
					  <input id="port" placeholder="3311" type="text">
					</div>
				  </div>
				  <div class="two fields">
					<div class="field">
					  <label>Username</label>
					  <input id="username" placeholder="runSqlQuery" type="text">
					</div>
					<div class="field">
					  <label>Password</label>
					  <input id="password" placeholder="123password567" type="text">
					</div>
				</div>
			  </div>
				<div class="field">
				  <label>Database <text id=showPath style="display: none;">Path</text></label>
				 <input id="database" placeholder="dbm" type="text">
				</div>
				<div class="tiny ui labeled button" tabindex="0">
				  <div id="checkConnection"class="ui button"><i class="refresh icon"></i>Check</div>
				  <a id="checkConnection_lbl" class="ui basic label yellow">Ready</a>
				</div>
			 </div>            
			</div>
		</form>
		</div>    
	<div>
		<br><label for="query">Query String</label>
        <textarea id="query" class="round" placeholder="SELECT * FROM 'users'" style="width: 99%; resize: none;" type="textarea" rows="8" cols="20"></textarea><br>
	</div>
		<div style="float: left; width: 35%;">
			 Store Results In:<br>
			 <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
			 ${data.variables[0]}
			 </select><br>
		</div>
		<div id="varNameContainer" style="display: ; float: right; width: 60%;">
			  Variable Name:<br>
			 <input id="varName" class="round" type="text"><br>
          </div>     
          <div style="float: left; width: 30%;">
            <br>Debug Mode: (Enable to see verbose printing in the bot console)<br>
            <select id="debugMode" class="round">
                <option value="1" selected>Enabled</option>
                <option value="0" >Disabled</option>
            </select>
        </div>
  </div>     
  <style>
		span.wrexlink {
		  color: #99b3ff;
		  text-decoration:underline;
		  cursor:pointer;
		}
		span.wrexlink:hover { 
		  color:#4676b9; 
		}
  </style>`
    },

    //---------------------------------------------------------------------
    // Action Editor Init Code
    //
    // When the HTML is first applied to the action editor, this code
    // is also run. This helps add modifications or setup reactionary
    // functions for the DOM elements.
    //---------------------------------------------------------------------
    init: function () {
        const {
            glob,
            document
        } = this;


        try {

            const type = document.getElementById("otype").value;
            const hostname = document.getElementById("hostname").value;
            const port = document.getElementById("port").value;
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const database = document.getElementById("database").value;

            var WrexMODS = require(require('path').join(__dirname, 'aaa_wrexmods_dependencies_MOD.js')).getWrexMods();

            //if(WrexMODS.)

            var Sequelize = require('sequelize');
                 
            function getType(key){
                switch (key) {
                    case "0":
                        return "mysql";
                    case "1":
                        return "postgres";
                    case "2":
                        return "mssql";
                    case "3":
                        return "sqlite";
                
                    default:
                        return "sqlite";
                }
            }

            var options =  {
                host: (hostname || 'localhost'),
                port: (port || "3311"),
                dialect: (getType(type) || 'sqlite'),
                operatorsAliases: false,
            
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                },              
            }

            if(getType(type) ==="sqlite") options["storage"] = ( require('path').resolve(database) || 'database.sqlite');
            global.sequelize = new Sequelize(database || 'database', username || 'username', password || 'password', options);

            document.getElementById("checkConnection").onclick = function (evt) {
                document.getElementById("checkConnection_lbl").setAttribute("class", "ui basic label yellow");
                document.getElementById("checkConnection_lbl").innerHTML = "Checking...";

                sequelize.authenticate()
                .then(() => {
                  console.log('Connection has been established successfully.');
                  isValid(true)
                })
                .catch(err => {
                  console.error('Unable to connect to the database:', err);
                  isValid(false, err)
                });

            };
 
            function isValid(bool, message = false){
                document.getElementById("checkConnection_lbl").setAttribute("class", "ui basic label " + (bool ? "green" : "red"))
                document.getElementById("checkConnection_lbl").innerHTML = ( (bool ? "Valid" :  "Invalid") + (message ? ": " + message : "") )
            }


            // to show/hide certian connection options if sqllite is selected
            document.getElementById("otype").onchange = function (evt) {
                var lite = (evt.target.value === "3")
                document.getElementById("auth").style.display = lite ? "none" : "";
                document.getElementById("showPath").style.display = lite ? "" : "none";
                document.getElementById("database").setAttribute("placeholder", "c:/mydb.sql")
            };

            // interactive links
            var wrexlinks = document.getElementsByClassName("wrexlink")
            for (var x = 0; x < wrexlinks.length; x++) {

                var wrexlink = wrexlinks[x];
                var url = wrexlink.getAttribute('data-url');
                if (url) {
                    wrexlink.setAttribute("title", url);
                    wrexlink.addEventListener("click", function (e) {
                        e.stopImmediatePropagation();
                        console.log("Launching URL: [" + url + "] in your default browser.")
                        require('child_process').execSync('start ' + url);
                    });
                }
            }

        } catch (error) {
            // write any init errors to errors.txt in dbm's main directory
            require("fs").appendFile("errors.txt", error.stack ? error.stack : error + "\r\n");
        }

        glob.variableChange(document.getElementById('storage'), 'varNameContainer');

    },

    //---------------------------------------------------------------------
    // Action Bot Function
    //
    // This is the function for the action within the Bot's Action class.
    // Keep in mind event calls won't have access to the "msg" parameter, 
    // so be sure to provide checks for variable existance.
    //---------------------------------------------------------------------

    action: function (cache) {

        //fields: ["storage", "varName", "hostname","port","username","password","database", "query", "otype"],

        var _this = this;

        const data = cache.actions[cache.index];

        const varName = this.evalMessage(data.varName, cache);
        const storage = parseInt(data.storage);

        // 0=mysql, 1=postgres, 2=mssql, 3=sqllite
        const type = data.otype;

        const hostname = this.evalMessage(data.hostname, cache);
        const port = this.evalMessage(data.port, cache);

        const username = this.evalMessage(data.username, cache);
        const password = this.evalMessage(data.password, cache);

        const DEBUG = parseInt(data.debugMode);

        const database = this.evalMessage(data.database, cache);

        const query = this.evalMessage(data.query, cache);

        var WrexMODS = this.getWrexMods();

        
        WrexMODS.CheckAndInstallNodeModule('sequelize');
        WrexMODS.CheckAndInstallNodeModule('mysql2');
        WrexMODS.CheckAndInstallNodeModule('pg-hstore');
        WrexMODS.CheckAndInstallNodeModule('tedious');
        WrexMODS.CheckAndInstallNodeModule('sqlite3');

        try {

            var Sequelize = require('sequelize');
                    
            function getType(key){
                let res;
                switch (key) {
                    case "0":                   
                        res=  "mysql";
                        break;
                    case "1":                 
                        res= "postgres";
                        break;
                    case "2":
                        res= "mssql";
                        break;
                    case "3":                 
                        res= "sqlite";
                        break;
                    default:
                        res= "sqlite";
                        break;
                }
                return res;
            }

            var options =  {
                host: (hostname || 'localhost'),
                port: (port || "3311"),
                dialect: (getType(type) || 'sqlite'),
                operatorsAliases: false,
            
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                },              
            }

            var errors = [];

            if(getType(type) ==="sqlite") options["storage"] = ( require('path').resolve(database) || 'database.sqlite');
            global.sequelize = new Sequelize(database || 'database', username || 'username', password || 'password', options);

            if(DEBUG) console.log(getType(type) + " query: " + query + '\r\n');

            var myQuery = sequelize.query(query);

            myQuery.catch(function(err){
                _this.storeValue({ name: err.name, code: err.parent.code, message: err.parent.sqlMessage}, storage, varName, cache);
                _this.callNextAction(cache);
            })
            
            myQuery.spread(function(results, metadata) {

                if(results && DEBUG){
                    console.log('\nStored value(s);\r\n');

                    for (i = 0; i < results.length; i++) {
                        console.log('[' + i + '] = ' + JSON.stringify(results[i]));
                    }

                    console.log('\r\nAppend the key that you want to store that value to the variable.');

                    const storageType = ['', 'tempVars', 'serverVars', 'globalVars'];
                    var output = storageType[storage];

                   
                    console.log('Example ${'+output+'("'+ varName +'")} to ${'+output+'("'+ varName +'")[key]}');
                    console.log(''+ varName +'[key] if not using it as a template\r\n');
                    console.log('Append the path to the end after the key or use the Parse From Stored JSON mod,\nin order to get the value you want');
                    console.log('Example ${'+output+'("'+ varName +'")[key].path} or use the json path box in the mod UI.');
                }
                

                _this.storeValue(results, storage, varName, cache);                   
                _this.callNextAction(cache);

            })

        } catch (error) {
            console.error("SQL Mod Error: " + (error.stack ? error.stack : error));
        }
      
    },

    //---------------------------------------------------------------------
    // Action Bot Mod
    //
    // Upon initialization of the bot, this code is run. Using the bot's
    // DBM namespace, one can add/modify existing functions if necessary.
    // In order to reduce conflictions between mods, be sure to alias
    // functions you wish to overwrite.
    //---------------------------------------------------------------------

    mod: function (DBM) {

    }

}; // End of module
