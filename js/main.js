"use strict";


var main = (function () {
    /**
     * CONFIGS
     */
    var configs = (function () {
        var instance;
        var Singleton = function (options) {
            var options = options || Singleton.defaultOptions;
            for (var key in Singleton.defaultOptions) {
                this[key] = options[key] || Singleton.defaultOptions[key];
            }
        };
        Singleton.defaultOptions = {
            general_help: "Below there's a list of commands that you can use.\nYou can use autofill by pressing the TAB key, autocompleting if there's only 1 possibility, or showing you a list of possibilities.",
            ls_help: "List information about the files and folders (the current directory by default).",
            cat_help: "Read FILE(s) content and print it to the standard output (screen).",
            whoami_help: "Print the user name associated with the current effective user ID and more info.",
            date_help: "Print the system date and time.",
            help_help: "Print this menu.",
            clear_help: "Clear the terminal screen.",
            cat: "Reads files sequentially, displaying their content to the terminal",
            reboot_help: "Reboot the system.",
            cd_help: "Change the current working directory.",
            mv_help: "Move (rename) files.",
            rm_help: "Remove files or directories.",
            rmdir_help: "Remove directory, this command will only work if the folders are empty.",
            touch_help: "Change file timestamps. If the file doesn't exist, it's created an empty one.",
            sudo_help: "Execute a command as the superuser.",
            welcome: "==========================================================================================================================\n" +
                "Hi, I am Nikhil Singh, a Software Engineer at Electronic Arts Inc.\n"+
                "Please use the 'help' command to see the list of available options and get to know me. \n" +
                "In order to skip text rolling, double click/touch anywhere.\n" +
                "==========================================================================================================================\n",
            internet_explorer_warning: "NOTE: I see you're using internet explorer, this website won't work properly.",
            welcome_file_name: "welcome_message.txt",
            invalid_command_message: "<value>: command not found.",
            reboot_message: "Preparing to reboot...\n\n3...\n\n2...\n\n1...\n\nRebooting...\n\n",
            permission_denied_message: "Unable to '<value>', permission denied.",
            sudo_message: "Unable to sudo since Nikhil is the super user for this website.",
            usage: "Usage",
            file: "file",
            file_not_found: "File '<value>' not found.",
            username: "Username",
            hostname: "Host",
            platform: "Platform",
            accesible_cores: "Accessible cores",
            language: "Language",
            value_token: "<value>",
            host: "example.com",
            user: "guest",
            is_root: false,
            type_delay: 10
        };
        return {
            getInstance: function (options) {
                instance === void 0 && (instance = new Singleton(options));
                return instance;
            }
        };
    })();
    var files = (function () {
        var instance;
        var Singleton = function (options) {
            var options = options || Singleton.defaultOptions;
            for (var key in Singleton.defaultOptions) {
                this[key] = options[key] || Singleton.defaultOptions[key];
            }
        };
        Singleton.defaultOptions = {
            "contact.txt": "Email: nik.singh1208@gmail.com\n" +
                "Phone No.: +1-(319)-259-2337",
            "academics.txt": "==========================================================================================================================\n" +
                "University of Iowa, Iowa, IA (GPA: 3.9/4.0) Aug-2021 – Dec-2022\n" +
                "Masters in Computer Science \n" +
                "Related Courses: Analysis of Algorithms, Artificial Intelligence, Limits of Computation, Advanced Cloud Computing\n" +
                "------------------------------------------------------------------------------------------------------------------------\n" +
                "University of Mumbai, Mumbai, INDIA (GPA: 4.0/4.0) Aug 2014 – Aug 2018\n" +
                "Bachelor of Technology in Computer Science and Engineering (CSE)\n" +
                "Related Courses: Data Structures, Algorithms, Software Development, Machine Learning, Operating Systems, Web Development\n" +
                "==========================================================================================================================",
            "technologies.txt":
                "==========================================================================================================================\n" +
                "Some of the technologies I've worked on: \n" +
                "Languages: C++/ C#, Python, Java, HTML, JavaScript, Typescript, Go\n" +
                "Cloud: GCP, AWS\n"+
                "Analytical Tools: Looker Studio, Power BI, Tableau, Grafana\n"+
                "Tools: Apache Spark, Terraform, Airflow, Neo 4j, Docker, Kubernetes \n"+
                "Libraries: PySpark, NumPy, Node.js, CUDA, RAPIDS, Tensorflow \n"+
                "Database: MySQL, MongoDB, NoSQL, SQL Server Hadoop, Apache HBase\n" +
                "Web Technologies: Angular, JavaScript, React, REST, Git, Bootstrap\n" +
                "==========================================================================================================================",
            "experience.txt":
                "==========================================================================================================================\n" +
                "Software Software Engineer | Electronic Arts Inc | Redwood City, CA, USA.  Dec 2022-Present\n\n" +
                "------------------------------------------------------------------------------------------------------------------------\n" +
                "Artificial Intelligence and Data Science Intern | Electronic Arts Inc | Redwood City, CA, USA.  Aug 2022-Dec 2022\n\n" +
                "------------------------------------------------------------------------------------------------------------------------\n" +
                "Research Assistant - Software Developer | University of Iowa | Iowa City, IA, USA.  Sep 2021-Aug 2022\n\n" +
                "------------------------------------------------------------------------------------------------------------------------\n" +
                "Senior Software Development Engineer | Nvent | Mumbai, India.  Oct 2017-Sep 2021\n\n" +
                "==========================================================================================================================",
            "github": "https://github.com/Nik-luftmensch",
            "linkedIn": "https://www.linkedin.com/in/nikhil-singh-828348137/",
            // "resume" : "xyc"
        };
        return {
            getInstance: function (options) {
                instance === void 0 && (instance = new Singleton(options));
                return instance;
            }
        };
    })();

    /**
     * AUX FUNCTIONS
     */

    var isUsingIE = window.navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./);

    var ignoreEvent = (function () {
        return function (event) {
            event.preventDefault();
            event.stopPropagation();
        };
    })();

    var scrollToBottom = (function () {
        return function () {
            window.scrollTo(0, document.body.scrollHeight);
        }
    })();

    /**
     * MODEL
     */

    var InvalidArgumentException = function (message) {
        this.message = message;
        // Use V8's native method if available, otherwise fallback
        if ("captureStackTrace" in Error) {
            Error.captureStackTrace(this, InvalidArgumentException);
        } else {
            this.stack = (new Error()).stack;
        }
    };

    // Extends Error
    InvalidArgumentException.prototype = Object.create(Error.prototype);
    InvalidArgumentException.prototype.name = "InvalidArgumentException";
    InvalidArgumentException.prototype.constructor = InvalidArgumentException;

    var cmds = {
        LS: { value: "ls", help: configs.getInstance().ls_help },
        CAT: { value: "cat", help: configs.getInstance().cat_help },
        WHOAMI: { value: "whoami", help: configs.getInstance().whoami_help },
        DATE: { value: "date", help: configs.getInstance().date_help },
        HELP: { value: "help", help: configs.getInstance().help_help },
        CLEAR: { value: "clear", help: configs.getInstance().clear_help },
        REBOOT: { value: "reboot", help: configs.getInstance().reboot_help },
        CD: { value: "cd", help: configs.getInstance().cd_help },
        MV: { value: "mv", help: configs.getInstance().mv_help },
        RM: { value: "rm", help: configs.getInstance().rm_help },
        RMDIR: { value: "rmdir", help: configs.getInstance().rmdir_help },
        TOUCH: { value: "touch", help: configs.getInstance().touch_help },
        SUDO: { value: "sudo", help: configs.getInstance().sudo_help }
    };


    var Terminal = function (prompt, cmdLine, output, sidenav, profilePic, user, host, root, outputTimer) {
        if (!(prompt instanceof Node) || prompt.nodeName.toUpperCase() !== "DIV") {
            throw new InvalidArgumentException("Invalid value " + prompt + " for argument 'prompt'.");
        }
        if (!(cmdLine instanceof Node) || cmdLine.nodeName.toUpperCase() !== "INPUT") {
            throw new InvalidArgumentException("Invalid value " + cmdLine + " for argument 'cmdLine'.");
        }
        if (!(output instanceof Node) || output.nodeName.toUpperCase() !== "DIV") {
            throw new InvalidArgumentException("Invalid value " + output + " for argument 'output'.");
        }
        if (!(sidenav instanceof Node) || sidenav.nodeName.toUpperCase() !== "DIV") {
            throw new InvalidArgumentException("Invalid value " + sidenav + " for argument 'sidenav'.");
        }
        if (!(profilePic instanceof Node) || profilePic.nodeName.toUpperCase() !== "IMG") {
            throw new InvalidArgumentException("Invalid value " + profilePic + " for argument 'profilePic'.");
        }
        (typeof user === "string" && typeof host === "string") && (this.completePrompt = user + "@" + host + ":~" + (root ? "#" : "$"));
        this.profilePic = profilePic;
        this.prompt = prompt;
        this.cmdLine = cmdLine;
        this.output = output;
        this.sidenav = sidenav;
        this.sidenavOpen = false;
        this.sidenavElements = [];
        this.typeSimulator = new TypeSimulator(outputTimer, output);
    };

    Terminal.prototype.scrollToBottom = function () {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'  // Use smooth scrolling behavior
        });
    };
    
    Terminal.prototype.type = function (text, callback) {
        this.typeSimulator.type(text, callback);
        this.scrollToBottom();
    };

    Terminal.prototype.exec = function () {
        var command = this.cmdLine.value;
        this.cmdLine.value = "";
        this.prompt.textContent = "";
        this.output.innerHTML += "<span class=\"prompt-color\">" + this.completePrompt + "</span> " + "<span class=\"prompt-color2\">" + command + "</span><br/>";
    };
    


    Terminal.prototype.init = function () {
       // Lock the terminal initially
       this.lock();

       // Set the flag to track if the welcome message is rolling
       this.welcomeMessageRolling = true;
       var self = this;

       // Fetch user's location based on IP address
       // Fetch user's location based on IP address
    fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(ipData => {
        const userIPAddress = ipData.ip;
        // Fetch user's location based on IP address
        fetch(`https://ipapi.co/${userIPAddress}/json/`)
            .then(response => response.json())
            .then(locationData => {
                const userCity = locationData.city;
                // Update the complete prompt with the user's city name and IP address
                self.completePrompt = `${userCity}@${userIPAddress}:~${(configs.getInstance().is_root ? "#" : "$")}`;
                // Store IP address and location as properties of the Terminal object
                self.guestIPAddress = userIPAddress;
                self.guestLocation = userCity;
                // Unlock the terminal after fetching the city name and IP address only if the welcome message is not rolling
                if (!self.welcomeMessageRolling) {
                    self.unlock();
                }
            })
            .catch(error => {
                console.error('Error fetching user location:', error);
                // If there's an error fetching location, use default prompt with IP address only
                self.completePrompt = `${configs.getInstance().user}@${userIPAddress}:~${(configs.getInstance().is_root ? "#" : "$")}`;
                // Store IP address as a property of the Terminal object
                self.guestIPAddress = userIPAddress;
                // Unlock the terminal only if the welcome message is not rolling
                if (!self.welcomeMessageRolling) {
                    self.unlock();
                }
            });
    })
    this.scrollToBottom();
        this.sidenav.addEventListener("click", ignoreEvent);
        this.cmdLine.disabled = true;
        this.sidenavElements.forEach(function (elem) {
            elem.disabled = true;
        });
        this.prepareSideNav();
        this.lock(); // Need to lock here since the sidenav elements were just added
        document.body.addEventListener("click", function (event) {
            if (this.sidenavOpen) {
                this.handleSidenav(event);
            }
            this.focus();
        }.bind(this));
        this.cmdLine.addEventListener("keydown", function (event) {
            if (event.which === 13 || event.keyCode === 13) {
                this.handleCmd();
                ignoreEvent(event);
            } else if (event.which === 9 || event.keyCode === 9) {
                this.handleFill();
                ignoreEvent(event);
            }
        }.bind(this));
        this.reset();
    };



    Terminal.makeElementDisappear = function (element) {
        element.style.opacity = 0;
        element.style.transform = "translateX(-300px)";
    };

    Terminal.makeElementAppear = function (element) {
        element.style.opacity = 1;
        element.style.transform = "translateX(0)";
    };

    Terminal.prototype.prepareSideNav = function () {
        var capFirst = (function () {
            return function (string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        })();
        for (var file in files.getInstance()) {
            var element = document.createElement("button");
            Terminal.makeElementDisappear(element);
            element.onclick = function (file, event) {
                this.handleSidenav(event);
                this.cmdLine.value = "cat " + file + " ";
                this.handleCmd();
            }.bind(this, file);
            element.appendChild(document.createTextNode(capFirst(file.replace(/\.[^/.]+$/, "").replace(/_/g, " "))));
            this.sidenav.appendChild(element);
            this.sidenavElements.push(element);
        }
        // Shouldn't use document.getElementById but Terminal is already using loads of params
        document.getElementById("sidenavBtn").addEventListener("click", this.handleSidenav.bind(this));
        
        
        // ABOUT YOU 
        
        var aboutYouBtn = document.createElement("button");
        Terminal.makeElementDisappear(aboutYouBtn);
        // Add emoji before the button text
        aboutYouBtn.innerHTML = "About You &#128526; ";
        aboutYouBtn.onclick = function (event) {
            this.handleSidenav(event);
            this.cmdLine.value = "whoami";
            this.handleCmd();
        }.bind(this);
        this.sidenav.appendChild(aboutYouBtn);
        this.sidenavElements.push(aboutYouBtn);
    };

    Terminal.prototype.handleSidenav = function (event) {
        if (this.sidenavOpen) {
            this.profilePic.style.opacity = 0;
            this.sidenavElements.forEach(Terminal.makeElementDisappear);
            this.sidenav.style.width = "50px";
            document.getElementById("sidenavBtn").innerHTML = "&#9776;";
            this.sidenavOpen = false;
        } else {
            this.sidenav.style.width = "300px";
            this.sidenavElements.forEach(Terminal.makeElementAppear);
            document.getElementById("sidenavBtn").innerHTML = "&#9886;";
            this.profilePic.style.opacity = 1;
            this.sidenavOpen = true;
        }
        document.getElementById("sidenavBtn").blur();
        ignoreEvent(event);
    };

    Terminal.prototype.lock = function () {
        this.exec();
        this.cmdLine.blur();
        this.cmdLine.disabled = true;
        this.sidenavElements.forEach(function (elem) {
            elem.disabled = true;
        });
    };

    Terminal.prototype.unlock = function () {
        this.cmdLine.disabled = false;
        this.prompt.textContent = this.completePrompt;
        this.sidenavElements.forEach(function (elem) {
            elem.disabled = false;
        });
        scrollToBottom();
        this.focus();
    };

    Terminal.prototype.handleFill = function () {
        var cmdComponents = this.cmdLine.value.trim().split(" ");
    
        // Ensure there are at least two components for tab completion
        if (cmdComponents.length < 2) {
            return;
        }
    
        var possibilities = [];
    
        // Check if the first command is 'cat'
        if (cmdComponents[0].toLowerCase() === cmds.CAT.value) {
            // Check if the user input matches 'welcome_file_name'
            if (configs.getInstance().welcome_file_name.startsWith(cmdComponents[1].toLowerCase())) {
                possibilities.push(cmds.CAT.value + " " + configs.getInstance().welcome_file_name);
            }
    
            // Check if the user input matches any file names
            for (var file in files.getInstance()) {
                if (file.startsWith(cmdComponents[1].toLowerCase())) {
                    possibilities.push(cmds.CAT.value + " " + file);
                }
            }
        } else {
            // Check if the user input matches any valid commands
            for (var command in cmds) {
                if (cmds[command].value.startsWith(cmdComponents[0].toLowerCase())) {
                    possibilities.push(cmds[command].value);
                }
            }
        }
    
        // Check if 'LinkedIn' matches the user input
        if ("Linkedin".startsWith(cmdComponents[1].toLowerCase())) {
            possibilities.push(cmds.CAT.value + "linkedIn");
        }
    
        // Check if 'GitHub' matches the user input
        if ("Github".startsWith(cmdComponents[1].toLowerCase())) {
            possibilities.push(cmds.CAT.value + "github");
        }

        // if ("Resume".startsWith(cmdComponents[1].toLowerCase())) {
        //     possibilities.push(cmds.CAT.value + "resume");
        // }
    
        // If there's only one possibility, complete the command
        if (possibilities.length === 1) {
            this.cmdLine.value = possibilities[0] + " ";
            this.unlock();
        } else if (possibilities.length > 1) {
            // If there are multiple possibilities, display them
            this.type(possibilities.join("\n"), function () {
                this.cmdLine.value = cmdComponents.join(" ");
                this.unlock();
            }.bind(this));
        } else {
            // If there are no possibilities, unlock the terminal without changes
            this.unlock();
        }
    };
     

    Terminal.prototype.handleCmd = function () {
        var cmdComponents = this.cmdLine.value.trim().split(" ");
        this.lock();
        switch (cmdComponents[0]) {
            case cmds.CAT.value:
                this.cat(cmdComponents);
                break;
            case cmds.LS.value:
                this.ls();
                break;
            case cmds.WHOAMI.value:
                this.whoami();
                break;
            case cmds.DATE.value:
                this.date();
                break;
            case cmds.HELP.value:
                this.help();
                break;
            case cmds.CLEAR.value:
                this.clear();
                break;
            case cmds.REBOOT.value:
                this.reboot();
                break;
            case cmds.CD.value:
            case cmds.MV.value:
            case cmds.RMDIR.value:
            case cmds.RM.value:
            case cmds.TOUCH.value:
                this.permissionDenied(cmdComponents);
                break;
            case cmds.SUDO.value:
                this.sudo();
                break;
            default:
                this.invalidCommand(cmdComponents);
                break;
        };
        this.scrollToBottom();
    };

    Terminal.prototype.cat = function (cmdComponents) {
        var result;
    
        if (cmdComponents.length <= 1) {
            result = configs.getInstance().usage + ": " + cmds.CAT.value + " <" + configs.getInstance().file + ">";
        } else if (!cmdComponents[1] || (!cmdComponents[1] === configs.getInstance().welcome_file_name && !files.getInstance().hasOwnProperty(cmdComponents[1]))) {
            result = configs.getInstance().file_not_found.replace(configs.getInstance().value_token, cmdComponents[1]);
        } else if (cmdComponents[1] !== configs.getInstance().welcome_file_name && !files.getInstance().hasOwnProperty(cmdComponents[1])) {
            // Check if the specified file is valid but not found in the files instance
            result = configs.getInstance().file_not_found.replace(configs.getInstance().value_token, cmdComponents[1]);
        } else {
            result = cmdComponents[1] === configs.getInstance().welcome_file_name ? configs.getInstance().welcome : files.getInstance()[cmdComponents[1]];
        }
        this.type(result, this.unlock.bind(this));
    };
    
    Terminal.prototype.ls = function () {
        var result = ".\n..\n" + configs.getInstance().welcome_file_name + "\n";
        for (var file in files.getInstance()) {
            result += file + "\n";
        }
        this.type(result.trim(), this.unlock.bind(this));
    };

    Terminal.prototype.sudo = function () {
        this.type(configs.getInstance().sudo_message, this.unlock.bind(this));
    }

     Terminal.prototype.whoami = function () {
        var result = "Username: " + configs.getInstance().user + "\n" +
                     "Guest IP Address: " + this.guestIPAddress + "\n" +
                     "Guest Location: " + this.guestLocation + "\n" +
                     "Platform: " + navigator.platform + "\n" +
                     "System Language: " + navigator.language + "\n" + // Include system language
                     "Device Type: " + (navigator.userAgent.match(/Android/i) ? "Android Device" :
                                        (navigator.userAgent.match(/iPhone|iPad|iPod/i) ? "iOS Device" :
                                        (navigator.userAgent.match(/Windows Phone|Windows NT/i) ? "Windows Phone" :
                                        (navigator.userAgent.match(/Linux|X11/i) ? "Linux/Unix Device" :
                                        (navigator.userAgent.match(/Macintosh|MacIntel|MacPPC|Mac OS X/i) ? "Mac Device" :
                                        "Unknown"))))) + "\n" + // Include device type
                     "Accessible cores: " + navigator.hardwareConcurrency;
        this.type(result, this.unlock.bind(this));
    };

    Terminal.prototype.date = function (cmdComponents) {
        this.type(new Date().toString(), this.unlock.bind(this));
    };

    Terminal.prototype.help = function () {
        var result = configs.getInstance().general_help + "\n\n";
        for (var cmd in cmds) {
            result += cmds[cmd].value + " - " + cmds[cmd].help + "\n";
        }
        this.type(result.trim(), this.unlock.bind(this));
    };

    Terminal.prototype.clear = function () {
        this.output.textContent = "";
        this.prompt.textContent = "";
        this.prompt.textContent = this.completePrompt;
        this.unlock();
    };

    Terminal.prototype.reboot = function () {
        this.type(configs.getInstance().reboot_message, this.reset.bind(this));
    };

    Terminal.prototype.reset = function () {
        this.output.textContent = "";
        this.prompt.textContent = "";
        if (this.typeSimulator) {
            this.type(configs.getInstance().welcome + (isUsingIE ? "\n" + configs.getInstance().internet_explorer_warning : ""), function () {
                this.unlock();
            }.bind(this));
        }
    };

    Terminal.prototype.permissionDenied = function (cmdComponents) {
        this.type(configs.getInstance().permission_denied_message.replace(configs.getInstance().value_token, cmdComponents[0]), this.unlock.bind(this));
    };

    Terminal.prototype.invalidCommand = function (cmdComponents) {
        this.type(configs.getInstance().invalid_command_message.replace(configs.getInstance().value_token, cmdComponents[0]), this.unlock.bind(this));
    };

    Terminal.prototype.focus = function () {
        this.cmdLine.focus();
    };

    var TypeSimulator = function (timer, output) {
        var timer = parseInt(timer);
        if (timer === Number.NaN || timer < 0) {
            throw new InvalidArgumentException("Invalid value " + timer + " for argument 'timer'.");
        }
        if (!(output instanceof Node)) {
            throw new InvalidArgumentException("Invalid value " + output + " for argument 'output'.");
        }
        this.timer = timer;
        this.output = output;
    };

    TypeSimulator.prototype.type = function (text, callback) {
        var isURL = (function () {
            return function (str) {
                return (str.startsWith("http") || str.startsWith("www")) && str.indexOf(" ") === -1 && str.indexOf("\n") === -1;
            };
        })();
        if (isURL(text)) {
            window.open(text);
        }
        var i = 0;
        var output = this.output;
        var timer = this.timer;
        var skipped = false;
        var skip = function () {
            skipped = true;
        }.bind(this);
        document.addEventListener("dblclick", skip);
        (function typer() {
            if (i < text.length) {
                var char = text.charAt(i);
                var isNewLine = char === "\n";
                output.innerHTML += isNewLine ? "<br/>" : char;
                i++;
                if (!skipped) {
                    setTimeout(typer, isNewLine ? timer * 2 : timer);
                } else {
                    output.innerHTML += `${text.substring(i).replace(new RegExp('\n', 'g'), "<br/>")}<br/>`;
                    document.removeEventListener("dblclick", skip);
                    callback();
                }
            } else if (callback) {
                output.innerHTML += "<br/>";
                document.removeEventListener("dblclick", skip);
                callback();
            }
            scrollToBottom();
        })();
    };

    return {
        listener: function () {
            new Terminal(
                document.getElementById("prompt"),
                document.getElementById("cmdline"),
                document.getElementById("output"),
                document.getElementById("sidenav"),
                document.getElementById("profilePic"),
                configs.getInstance().user,
                configs.getInstance().host,
                configs.getInstance().is_root,
                configs.getInstance().type_delay
            ).init();
        }
    };
})();

window.onload = main.listener;