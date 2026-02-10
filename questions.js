// DevOps Interview Questions Database
const questionBank = {
    beginner: {
        linux: [
            {
                question: "What command is used to list files in a directory?",
                options: ["ls", "cd", "pwd", "mkdir"],
                correct: 0
            },
            {
                question: "Which command changes the current directory?",
                options: ["ls", "cd", "mv", "cp"],
                correct: 1
            },
            {
                question: "What does the 'pwd' command do?",
                options: ["Print working directory", "Power down", "Process working data", "Print word document"],
                correct: 0
            },
            {
                question: "Which command is used to create a new directory?",
                options: ["rmdir", "mkdir", "touch", "create"],
                correct: 1
            },
            {
                question: "What command displays the contents of a file?",
                options: ["cat", "dog", "show", "display"],
                correct: 0
            },
            {
                question: "Which command removes a file?",
                options: ["delete", "remove", "rm", "del"],
                correct: 2
            },
            {
                question: "What does 'chmod' command do?",
                options: ["Change mode/permissions", "Change modification time", "Check mode", "Change owner"],
                correct: 0
            },
            {
                question: "Which command shows currently running processes?",
                options: ["process", "ps", "show", "list"],
                correct: 1
            },
            {
                question: "What is the superuser account called in Linux?",
                options: ["admin", "root", "super", "master"],
                correct: 1
            },
            {
                question: "Which command is used to search for text in files?",
                options: ["find", "search", "grep", "look"],
                correct: 2
            }
        ],
        terraform: [
            {
                question: "What is Terraform primarily used for?",
                options: ["Configuration management", "Infrastructure as Code", "Container orchestration", "Continuous Integration"],
                correct: 1
            },
            {
                question: "Which command initializes a Terraform working directory?",
                options: ["terraform start", "terraform init", "terraform begin", "terraform setup"],
                correct: 1
            },
            {
                question: "What file extension do Terraform configuration files use?",
                options: [".tf", ".terraform", ".txt", ".config"],
                correct: 0
            },
            {
                question: "Which command shows the execution plan in Terraform?",
                options: ["terraform show", "terraform plan", "terraform preview", "terraform execute"],
                correct: 1
            },
            {
                question: "What command applies the Terraform changes?",
                options: ["terraform execute", "terraform run", "terraform apply", "terraform deploy"],
                correct: 2
            },
            {
                question: "What is Terraform state used for?",
                options: ["Storing logs", "Tracking infrastructure", "Managing users", "Storing secrets"],
                correct: 1
            },
            {
                question: "Which company developed Terraform?",
                options: ["Google", "Amazon", "HashiCorp", "Microsoft"],
                correct: 2
            },
            {
                question: "What command destroys Terraform-managed infrastructure?",
                options: ["terraform delete", "terraform remove", "terraform destroy", "terraform clean"],
                correct: 2
            },
            {
                question: "What language does Terraform use for configuration?",
                options: ["YAML", "JSON", "HCL", "XML"],
                correct: 2
            },
            {
                question: "What is a Terraform provider?",
                options: ["A user account", "A plugin to interact with APIs", "A configuration file", "A state file"],
                correct: 1
            }
        ],
        aws: [
            {
                question: "What does EC2 stand for?",
                options: ["Elastic Compute Cloud", "Easy Computer Connection", "Electronic Cloud Computing", "Elastic Container Cloud"],
                correct: 0
            },
            {
                question: "What is S3 used for?",
                options: ["Computing", "Storage", "Networking", "Database"],
                correct: 1
            },
            {
                question: "Which AWS service is a managed relational database?",
                options: ["DynamoDB", "RDS", "S3", "EC2"],
                correct: 1
            },
            {
                question: "What does IAM stand for?",
                options: ["Internet Access Management", "Identity and Access Management", "Internal Application Manager", "Integrated Account Management"],
                correct: 1
            },
            {
                question: "Which service is used for content delivery (CDN)?",
                options: ["Route 53", "CloudFront", "S3", "ELB"],
                correct: 1
            },
            {
                question: "What is AWS Lambda?",
                options: ["A database", "A serverless compute service", "A storage service", "A networking tool"],
                correct: 1
            },
            {
                question: "Which service provides DNS services?",
                options: ["CloudFront", "Route 53", "VPC", "Direct Connect"],
                correct: 1
            },
            {
                question: "What is Amazon VPC?",
                options: ["Virtual Private Cloud", "Virtual Public Connection", "Virtual Process Container", "Virtual Private Connection"],
                correct: 0
            },
            {
                question: "Which AWS service is used for load balancing?",
                options: ["EBS", "ELB", "EC2", "EFS"],
                correct: 1
            },
            {
                question: "What is CloudWatch used for?",
                options: ["Storage", "Monitoring", "Computing", "Networking"],
                correct: 1
            }
        ],
        ansible: [
            {
                question: "What type of tool is Ansible?",
                options: ["Monitoring", "Configuration Management", "Database", "Load Balancer"],
                correct: 1
            },
            {
                question: "What language are Ansible playbooks written in?",
                options: ["JSON", "XML", "YAML", "Python"],
                correct: 2
            },
            {
                question: "Does Ansible require agents on managed nodes?",
                options: ["Yes", "No", "Sometimes", "Only on Windows"],
                correct: 1
            },
            {
                question: "What protocol does Ansible primarily use?",
                options: ["HTTP", "FTP", "SSH", "SMTP"],
                correct: 2
            },
            {
                question: "What is an Ansible playbook?",
                options: ["A log file", "A configuration file defining tasks", "A monitoring dashboard", "A database schema"],
                correct: 1
            },
            {
                question: "What is an inventory file in Ansible?",
                options: ["List of tasks", "List of managed hosts", "List of users", "List of variables"],
                correct: 1
            },
            {
                question: "Which company originally developed Ansible?",
                options: ["HashiCorp", "Red Hat", "Docker", "Google"],
                correct: 1
            },
            {
                question: "What is an Ansible role?",
                options: ["User permission", "Reusable automation content", "Network configuration", "Database role"],
                correct: 1
            },
            {
                question: "What command runs an Ansible playbook?",
                options: ["ansible run", "ansible-playbook", "ansible execute", "ansible start"],
                correct: 1
            },
            {
                question: "Can Ansible manage both Linux and Windows systems?",
                options: ["Only Linux", "Only Windows", "Both", "Neither"],
                correct: 2
            }
        ],
        docker: [
            {
                question: "What is Docker primarily used for?",
                options: ["Virtualization", "Containerization", "Monitoring", "Load Balancing"],
                correct: 1
            },
            {
                question: "What is a Docker image?",
                options: ["A running container", "A template for containers", "A network configuration", "A storage volume"],
                correct: 1
            },
            {
                question: "What command lists running Docker containers?",
                options: ["docker list", "docker ps", "docker show", "docker containers"],
                correct: 1
            },
            {
                question: "What file defines a Docker image?",
                options: ["Dockerconfig", "Dockerfile", "docker.yml", "image.conf"],
                correct: 1
            },
            {
                question: "What command builds a Docker image?",
                options: ["docker create", "docker make", "docker build", "docker compile"],
                correct: 2
            },
            {
                question: "What is Docker Hub?",
                options: ["A container runtime", "A registry for Docker images", "A monitoring tool", "A network driver"],
                correct: 1
            },
            {
                question: "What command runs a Docker container?",
                options: ["docker start", "docker execute", "docker run", "docker launch"],
                correct: 2
            },
            {
                question: "What is a Docker volume?",
                options: ["A network", "A persistent data storage", "A container image", "A configuration file"],
                correct: 1
            },
            {
                question: "What command stops a running container?",
                options: ["docker end", "docker halt", "docker stop", "docker kill"],
                correct: 2
            },
            {
                question: "What port does Docker daemon typically listen on?",
                options: ["8080", "3000", "2375/2376", "5000"],
                correct: 2
            }
        ],
        kubernetes: [
            {
                question: "What is Kubernetes?",
                options: ["A container runtime", "A container orchestration platform", "A monitoring tool", "A CI/CD tool"],
                correct: 1
            },
            {
                question: "What is a Pod in Kubernetes?",
                options: ["A cluster", "Smallest deployable unit", "A network", "A storage unit"],
                correct: 1
            },
            {
                question: "What is kubectl?",
                options: ["A pod", "Command-line tool for Kubernetes", "A container", "A service"],
                correct: 1
            },
            {
                question: "What does K8s stand for?",
                options: ["Kubernetes", "Kube-eight-s", "Both A and B", "Neither"],
                correct: 2
            },
            {
                question: "What is a Kubernetes Service?",
                options: ["A pod", "An abstraction for network access to pods", "A container", "A volume"],
                correct: 1
            },
            {
                question: "Which company originally developed Kubernetes?",
                options: ["Amazon", "Microsoft", "Google", "Docker"],
                correct: 2
            },
            {
                question: "What is a Namespace in Kubernetes?",
                options: ["A virtual cluster", "A network segment", "A storage class", "A pod type"],
                correct: 0
            },
            {
                question: "What command gets all pods in Kubernetes?",
                options: ["kubectl list pods", "kubectl get pods", "kubectl show pods", "kubectl pods"],
                correct: 1
            },
            {
                question: "What is a Deployment in Kubernetes?",
                options: ["A network rule", "A declarative way to manage pods", "A storage volume", "A monitoring tool"],
                correct: 1
            },
            {
                question: "What is the default container runtime for Kubernetes?",
                options: ["Docker", "containerd", "rkt", "CRI-O"],
                correct: 1
            }
        ],
        git: [
            {
                question: "What is Git?",
                options: ["A version control system", "A programming language", "A web server", "A database"],
                correct: 0
            },
            {
                question: "What command initializes a new Git repository?",
                options: ["git start", "git init", "git new", "git create"],
                correct: 1
            },
            {
                question: "What command shows the status of your repository?",
                options: ["git show", "git status", "git info", "git state"],
                correct: 1
            },
            {
                question: "What command adds files to staging?",
                options: ["git stage", "git add", "git include", "git push"],
                correct: 1
            },
            {
                question: "What command commits staged changes?",
                options: ["git save", "git commit", "git push", "git write"],
                correct: 1
            },
            {
                question: "What is a Git branch?",
                options: ["A folder", "An independent line of development", "A file type", "A user group"],
                correct: 1
            },
            {
                question: "What command creates a new branch?",
                options: ["git new branch", "git branch", "git create branch", "git make branch"],
                correct: 1
            },
            {
                question: "What command switches branches?",
                options: ["git switch", "git checkout", "git change", "Both A and B"],
                correct: 3
            },
            {
                question: "What is GitHub?",
                options: ["A Git client", "A hosting service for Git repositories", "A version of Git", "A text editor"],
                correct: 1
            },
            {
                question: "What command uploads commits to a remote repository?",
                options: ["git upload", "git send", "git push", "git commit"],
                correct: 2
            }
        ]
    },
    intermediate: {
        linux: [
            {
                question: "What is the purpose of the /etc/passwd file?",
                options: ["Store passwords", "Store user account information", "System logs", "Network configuration"],
                correct: 1
            },
            {
                question: "Which command finds files by name?",
                options: ["locate", "find", "search", "grep"],
                correct: 1
            },
            {
                question: "What does the 'systemctl' command manage?",
                options: ["System time", "Systemd services", "System logs", "System users"],
                correct: 1
            },
            {
                question: "What permission value gives rwx to owner, rx to group and others?",
                options: ["777", "755", "644", "700"],
                correct: 1
            },
            {
                question: "Which command shows disk usage of filesystems?",
                options: ["du", "df", "disk", "free"],
                correct: 1
            },
            {
                question: "What does the 'top' command display?",
                options: ["Top directories", "Real-time system processes", "Top files", "Network connections"],
                correct: 1
            },
            {
                question: "How do you redirect both stdout and stderr to a file?",
                options: ["command > file 2>&1", "command >> file", "command > file", "command 2> file"],
                correct: 0
            },
            {
                question: "What is a symbolic link?",
                options: ["A hard copy", "A pointer to another file", "A compressed file", "A backup file"],
                correct: 1
            },
            {
                question: "Which command displays network connections?",
                options: ["netstat", "ifconfig", "ping", "traceroute"],
                correct: 0
            },
            {
                question: "What is cron used for?",
                options: ["Logging", "Scheduling tasks", "User management", "File compression"],
                correct: 1
            }
        ],
        terraform: [
            {
                question: "What is a Terraform module?",
                options: ["A single file", "A container for resources", "A state file", "A provider plugin"],
                correct: 1
            },
            {
                question: "How do you reference a variable in Terraform?",
                options: ["${var.name}", "var.name", "Both A and B", "variable.name"],
                correct: 2
            },
            {
                question: "What is terraform.tfstate file?",
                options: ["Configuration file", "State tracking file", "Variable file", "Module file"],
                correct: 1
            },
            {
                question: "What does 'terraform validate' do?",
                options: ["Validates syntax", "Applies changes", "Shows plan", "Destroys resources"],
                correct: 0
            },
            {
                question: "What is a data source in Terraform?",
                options: ["A database", "A way to fetch read-only information", "A storage location", "A network source"],
                correct: 1
            },
            {
                question: "How do you prevent a resource from being destroyed?",
                options: ["prevent_destroy = true", "lifecycle { prevent_destroy = true }", "protected = true", "lock = true"],
                correct: 1
            },
            {
                question: "What is terraform workspace used for?",
                options: ["Multiple state files", "Multiple providers", "Multiple modules", "Multiple users"],
                correct: 0
            },
            {
                question: "What does 'depends_on' do?",
                options: ["Creates dependency", "Destroys dependency", "Lists dependencies", "Validates dependencies"],
                correct: 0
            },
            {
                question: "What is the purpose of terraform.lock.hcl?",
                options: ["Lock state file", "Lock provider versions", "Lock resources", "Lock modules"],
                correct: 1
            },
            {
                question: "How do you import existing resources?",
                options: ["terraform add", "terraform import", "terraform include", "terraform merge"],
                correct: 1
            }
        ],
        aws: [
            {
                question: "What is an AMI?",
                options: ["Amazon Machine Image", "Amazon Machine Instance", "Amazon Module Interface", "Amazon Management Int
