// config.js

export const configs = {
    general_help:
      "Below there's a list of commands you can use.\nYou can use autofill by pressing TAB, autocompleting if there's only one possibility, or showing a list if there's more than one.",
    welcome: `==========================================================================================================================
  Hi, I am Nikhil Singh, a Software Engineer at Electronic Arts Inc.
  Please use the 'help' command to see a list of available commands and get to know me.
  You can try commands like:
    - ls
    - cat welcome_message.txt
    - cat technologies.txt
    - whoami
  Press the TAB key to autocomplete commands or filenames.
  Double click/touch anywhere to skip text rolling.
  ==========================================================================================================================`,
    invalid_command_message: "<value>: command not found.",
    reboot_message: "Preparing to reboot...\n\n3...\n\n2...\n\n1...\n\nRebooting...\n\n",
    permission_denied_message: "Unable to '<value>', permission denied.",
    sudo_message: "Unable to sudo since Nikhil is the superuser for this website.",
    file_not_found: "File '<value>' not found.",
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
  Tools: Apache Spark, Terraform, Airflow, Neo4j, Docker, Kubernetes
  Libraries: PySpark, NumPy, Node.js, CUDA, RAPIDS, Tensorflow
  Database: MySQL, MongoDB, NoSQL, SQL Server, Hadoop, Apache HBase
  Web Technologies: Angular, JavaScript, React, REST, Git, Bootstrap
  ==========================================================================================================================`,
    "experience.txt": `==========================================================================================================================
  Software Engineer | Electronic Arts Inc | Redwood City, CA
  ==========================================================================================================================`,
    "github": "https://github.com/Nik-luftmensch",
    "linkedIn": "https://linkedin.com/in/nikhil-singh-828348137/",
    "welcome_message.txt": "Welcome to my portfolio terminal!"
  };
  