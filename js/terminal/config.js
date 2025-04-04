// config.js

export const configs = {
    general_help:
      "Below there's a list of commands you can use.\nYou can use autofill by pressing TAB, autocompleting if there's only one possibility, or showing a list if there's more than one.",
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
    internet_explorer_warning: "NOTE: I see you're using internet explorer, this website won't work properly.",
    welcome: `==========================================================================================================================
  Hi, I am Nikhil Singh, a Software Engineer at Electronic Arts Inc.
  Please use the 'help' command to see a list of available commands and get to know me.
  You can try commands like:
    - ls
    - cat welcome_message.txt
    - cat technologies.txt
    - secure_connect {name} 
    - whoami
  Press the TAB key to autocomplete commands or filenames.
  Double click/touch anywhere to skip text rolling.
  ==========================================================================================================================`,
    invalid_command_message: "<value>: command not found.",
    reboot_message: "Preparing to reboot...\n\n3...\n\n2...\n\n1...\n\nRebooting...\n\n",
    permission_denied_message: "Unable to '<value>', permission denied.",
    sudo_message: "Unable to sudo since Nikhil is the superuser for this website.",
    usage: "Usage",
    file: "file",
    file_not_found: "File '<value>' not found.",
    username: "Username",
    hostname: "Host",
    platform: "Platform",
    accesible_cores: "Accessible cores",
    language: "Language",
    value_token: "<value>",
    welcome_file_name: "welcome_message.txt",
    host: "example.com",
    user: "guest",
    is_root: false,
    type_delay: 10
  };
  
  export const files = {
    "contact.txt": "Email: nik.singh1208@gmail.com\nPhone: +1-(319)-259-2337",
    "academics.txt": `==========================================================================================================================
  University of Iowa, Iowa, IA (GPA: 3.9/4.0) Aug-2021 – Dec-2022
  Masters in Computer Science 
  Related Courses: Analysis of Algorithms, Artificial Intelligence, Limits of Computation, Advanced Cloud Computing
  ------------------------------------------------------------------------------------------------------------------------
  University of Mumbai, Mumbai, INDIA (GPA: 4.0/4.0) Aug 2014 – Aug 2018
  Bachelor of Technology in Computer Science and Engineering (CSE)
  Related Courses: Data Structures, Algorithms, Software Development, Machine Learning, Operating Systems, Web Development
  ==========================================================================================================================`,
    "technologies.txt": `==========================================================================================================================
  Some of the technologies I've worked on: 
  Languages: C++/ C#, Python, Java, HTML, JavaScript, Typescript, Go
  Cloud: GCP, AWS
  Analytical Tools: Looker Studio, Power BI, Tableau, Grafana
  Tools: Apache Spark, Terraform, Airflow, Neo 4j, Docker, Kubernetes 
  Libraries: PySpark, NumPy, Node.js, CUDA, RAPIDS, Tensorflow 
  Database: MySQL, MongoDB, NoSQL, SQL Server Hadoop, Apache HBase
  Web Technologies: Angular, JavaScript, React, REST, Git, Bootstrap
  ==========================================================================================================================`,
    "experience.txt": `==========================================================================================================================
  Software Software Engineer | Electronic Arts Inc | Redwood City, CA, USA.  Dec 2022-Present
  
  ------------------------------------------------------------------------------------------------------------------------
  Artificial Intelligence and Data Science Intern | Electronic Arts Inc | Redwood City, CA, USA.  Aug 2022-Dec 2022
  
  ------------------------------------------------------------------------------------------------------------------------
  Research Assistant - Software Developer | University of Iowa | Iowa City, IA, USA.  Sep 2021-Aug 2022
  
  ------------------------------------------------------------------------------------------------------------------------
  Senior Software Development Engineer | Nvent | Mumbai, India.  Oct 2017-Sep 2021
  
  ==========================================================================================================================`,
    "github": "https://github.com/Nik-luftmensch",
    "linkedIn": "https://www.linkedin.com/in/nikhil-singh-828348137/",
    "welcome_message.txt": "Welcome to my portfolio terminal!"
  };
  