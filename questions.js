(function (root) {
const legacyQuestionBank = {
    beginner: {
        linux: [
            { question: "What command is used to list files in a directory?", options: ["ls", "cd", "pwd", "mkdir"], correct: 0 },
            { question: "Which command changes the current directory?", options: ["ls", "cd", "mv", "cp"], correct: 1 },
            { question: "What does the 'pwd' command do?", options: ["Print working directory", "Power down", "Process working data", "Print word document"], correct: 0 },
            { question: "Which command is used to create a new directory?", options: ["rmdir", "mkdir", "touch", "create"], correct: 1 },
            { question: "What command displays the contents of a file?", options: ["cat", "dog", "show", "display"], correct: 0 },
            { question: "Which command removes a file?", options: ["delete", "remove", "rm", "del"], correct: 2 },
            { question: "What does 'chmod' command do?", options: ["Change mode/permissions", "Change modification time", "Check mode", "Change owner"], correct: 0 },
            { question: "Which command shows currently running processes?", options: ["process", "ps", "show", "list"], correct: 1 },
            { question: "What is the superuser account called in Linux?", options: ["admin", "root", "super", "master"], correct: 1 },
            { question: "Which command is used to search for text in files?", options: ["find", "search", "grep", "look"], correct: 2 }
        ],
        terraform: [
            { question: "What is Terraform primarily used for?", options: ["Configuration management", "Infrastructure as Code", "Container orchestration", "Continuous Integration"], correct: 1 },
            { question: "Which command initializes a Terraform working directory?", options: ["terraform start", "terraform init", "terraform begin", "terraform setup"], correct: 1 },
            { question: "What file extension do Terraform configuration files use?", options: [".tf", ".terraform", ".txt", ".config"], correct: 0 },
            { question: "Which command shows the execution plan in Terraform?", options: ["terraform show", "terraform plan", "terraform preview", "terraform execute"], correct: 1 },
            { question: "What command applies the Terraform changes?", options: ["terraform execute", "terraform run", "terraform apply", "terraform deploy"], correct: 2 },
            { question: "What is Terraform state used for?", options: ["Storing logs", "Tracking infrastructure", "Managing users", "Storing secrets"], correct: 1 },
            { question: "Which company developed Terraform?", options: ["Google", "Amazon", "HashiCorp", "Microsoft"], correct: 2 },
            { question: "What command destroys Terraform-managed infrastructure?", options: ["terraform delete", "terraform remove", "terraform destroy", "terraform clean"], correct: 2 },
            { question: "What language does Terraform use for configuration?", options: ["YAML", "JSON", "HCL", "XML"], correct: 2 },
            { question: "What is a Terraform provider?", options: ["A user account", "A plugin to interact with APIs", "A configuration file", "A state file"], correct: 1 }
        ],
        aws: [
            { question: "What does EC2 stand for?", options: ["Elastic Compute Cloud", "Easy Computer Connection", "Electronic Cloud Computing", "Elastic Container Cloud"], correct: 0 },
            { question: "What is S3 used for?", options: ["Computing", "Storage", "Networking", "Database"], correct: 1 },
            { question: "Which AWS service is a managed relational database?", options: ["DynamoDB", "RDS", "S3", "EC2"], correct: 1 },
            { question: "What does IAM stand for?", options: ["Internet Access Management", "Identity and Access Management", "Internal Application Manager", "Integrated Account Management"], correct: 1 },
            { question: "Which service is used for content delivery (CDN)?", options: ["Route 53", "CloudFront", "S3", "ELB"], correct: 1 },
            { question: "What is AWS Lambda?", options: ["A database", "A serverless compute service", "A storage service", "A networking tool"], correct: 1 },
            { question: "Which service provides DNS services?", options: ["CloudFront", "Route 53", "VPC", "Direct Connect"], correct: 1 },
            { question: "What is Amazon VPC?", options: ["Virtual Private Cloud", "Virtual Public Connection", "Virtual Process Container", "Virtual Private Connection"], correct: 0 },
            { question: "Which AWS service is used for load balancing?", options: ["EBS", "ELB", "EC2", "EFS"], correct: 1 },
            { question: "What is CloudWatch used for?", options: ["Storage", "Monitoring", "Computing", "Networking"], correct: 1 }
        ],
        ansible: [
            { question: "What type of tool is Ansible?", options: ["Monitoring", "Configuration Management", "Database", "Load Balancer"], correct: 1 },
            { question: "What language are Ansible playbooks written in?", options: ["JSON", "XML", "YAML", "Python"], correct: 2 },
            { question: "Does Ansible require agents on managed nodes?", options: ["Yes", "No", "Sometimes", "Only on Windows"], correct: 1 },
            { question: "What protocol does Ansible primarily use?", options: ["HTTP", "FTP", "SSH", "SMTP"], correct: 2 },
            { question: "What is an Ansible playbook?", options: ["A log file", "A configuration file defining tasks", "A monitoring dashboard", "A database schema"], correct: 1 },
            { question: "What is an inventory file in Ansible?", options: ["List of tasks", "List of managed hosts", "List of users", "List of variables"], correct: 1 },
            { question: "Which company originally developed Ansible?", options: ["HashiCorp", "Red Hat", "Docker", "Google"], correct: 1 },
            { question: "What is an Ansible role?", options: ["User permission", "Reusable automation content", "Network configuration", "Database role"], correct: 1 },
            { question: "What command runs an Ansible playbook?", options: ["ansible run", "ansible-playbook", "ansible execute", "ansible start"], correct: 1 },
            { question: "Can Ansible manage both Linux and Windows systems?", options: ["Only Linux", "Only Windows", "Both", "Neither"], correct: 2 }
        ],
        docker: [
            { question: "What is Docker primarily used for?", options: ["Virtualization", "Containerization", "Monitoring", "Load Balancing"], correct: 1 },
            { question: "What is a Docker image?", options: ["A running container", "A template for containers", "A network configuration", "A storage volume"], correct: 1 },
            { question: "What command lists running Docker containers?", options: ["docker list", "docker ps", "docker show", "docker containers"], correct: 1 },
            { question: "What file defines a Docker image?", options: ["Dockerconfig", "Dockerfile", "docker.yml", "image.conf"], correct: 1 },
            { question: "What command builds a Docker image?", options: ["docker create", "docker make", "docker build", "docker compile"], correct: 2 },
            { question: "What is Docker Hub?", options: ["A container runtime", "A registry for Docker images", "A monitoring tool", "A network driver"], correct: 1 },
            { question: "What command runs a Docker container?", options: ["docker start", "docker execute", "docker run", "docker launch"], correct: 2 },
            { question: "What is a Docker volume?", options: ["A network", "A persistent data storage", "A container image", "A configuration file"], correct: 1 },
            { question: "What command stops a running container?", options: ["docker end", "docker halt", "docker stop", "docker kill"], correct: 2 },
            { question: "What port does Docker daemon typically listen on?", options: ["8080", "3000", "2375/2376", "5000"], correct: 2 }
        ],
        kubernetes: [
            { question: "What is Kubernetes?", options: ["A container runtime", "A container orchestration platform", "A monitoring tool", "A CI/CD tool"], correct: 1 },
            { question: "What is a Pod in Kubernetes?", options: ["A cluster", "Smallest deployable unit", "A network", "A storage unit"], correct: 1 },
            { question: "What is kubectl?", options: ["A pod", "Command-line tool for Kubernetes", "A container", "A service"], correct: 1 },
            { question: "What does K8s stand for?", options: ["Kubernetes", "Kube-eight-s", "Both A and B", "Neither"], correct: 2 },
            { question: "What is a Kubernetes Service?", options: ["A pod", "An abstraction for network access to pods", "A container", "A volume"], correct: 1 },
            { question: "Which company originally developed Kubernetes?", options: ["Amazon", "Microsoft", "Google", "Docker"], correct: 2 },
            { question: "What is a Namespace in Kubernetes?", options: ["A virtual cluster", "A network segment", "A storage class", "A pod type"], correct: 0 },
            { question: "What command gets all pods in Kubernetes?", options: ["kubectl list pods", "kubectl get pods", "kubectl show pods", "kubectl pods"], correct: 1 },
            { question: "What is a Deployment in Kubernetes?", options: ["A network rule", "A declarative way to manage pods", "A storage volume", "A monitoring tool"], correct: 1 },
            { question: "What is the default container runtime for Kubernetes?", options: ["Docker", "containerd", "rkt", "CRI-O"], correct: 1 }
        ],
        git: [
            { question: "What is Git?", options: ["A version control system", "A programming language", "A web server", "A database"], correct: 0 },
            { question: "What command initializes a new Git repository?", options: ["git start", "git init", "git new", "git create"], correct: 1 },
            { question: "What command shows the status of your repository?", options: ["git show", "git status", "git info", "git state"], correct: 1 },
            { question: "What command adds files to staging?", options: ["git stage", "git add", "git include", "git push"], correct: 1 },
            { question: "What command commits staged changes?", options: ["git save", "git commit", "git push", "git write"], correct: 1 },
            { question: "What is a Git branch?", options: ["A folder", "An independent line of development", "A file type", "A user group"], correct: 1 },
            { question: "What command creates a new branch?", options: ["git new branch", "git branch", "git create branch", "git make branch"], correct: 1 },
            { question: "What command switches branches?", options: ["git switch", "git checkout", "git change", "Both A and B"], correct: 3 },
            { question: "What is GitHub?", options: ["A Git client", "A hosting service for Git repositories", "A version of Git", "A text editor"], correct: 1 },
            { question: "What command uploads commits to a remote repository?", options: ["git upload", "git send", "git push", "git commit"], correct: 2 }
        ]
    },
    intermediate: {
        linux: [
            { question: "What is the purpose of the /etc/passwd file?", options: ["Store passwords", "Store user account information", "System logs", "Network configuration"], correct: 1 },
            { question: "Which command finds files by name?", options: ["locate", "find", "search", "grep"], correct: 1 },
            { question: "What does the 'systemctl' command manage?", options: ["System time", "Systemd services", "System logs", "System users"], correct: 1 },
            { question: "What permission value gives rwx to owner, rx to group and others?", options: ["777", "755", "644", "700"], correct: 1 },
            { question: "Which command shows disk usage of filesystems?", options: ["du", "df", "disk", "free"], correct: 1 },
            { question: "What does the 'top' command display?", options: ["Top directories", "Real-time system processes", "Top files", "Network connections"], correct: 1 },
            { question: "How do you redirect both stdout and stderr to a file?", options: ["command > file 2>&1", "command >> file", "command > file", "command 2> file"], correct: 0 },
            { question: "What is a symbolic link?", options: ["A hard copy", "A pointer to another file", "A compressed file", "A backup file"], correct: 1 },
            { question: "Which command displays network connections?", options: ["netstat", "ifconfig", "ping", "traceroute"], correct: 0 },
            { question: "What is cron used for?", options: ["Logging", "Scheduling tasks", "User management", "File compression"], correct: 1 }
        ],
        terraform: [
            { question: "What is a Terraform module?", options: ["A single file", "A container for resources", "A state file", "A provider plugin"], correct: 1 },
            { question: "How do you reference a variable in Terraform?", options: ["${var.name}", "var.name", "Both A and B", "variable.name"], correct: 2 },
            { question: "What is terraform.tfstate file?", options: ["Configuration file", "State tracking file", "Variable file", "Module file"], correct: 1 },
            { question: "What does 'terraform validate' do?", options: ["Validates syntax", "Applies changes", "Shows plan", "Destroys resources"], correct: 0 },
            { question: "What is a data source in Terraform?", options: ["A database", "A way to fetch read-only information", "A storage location", "A network source"], correct: 1 },
            { question: "How do you prevent a resource from being destroyed?", options: ["prevent_destroy = true", "lifecycle { prevent_destroy = true }", "protected = true", "lock = true"], correct: 1 },
            { question: "What is terraform workspace used for?", options: ["Multiple state files", "Multiple providers", "Multiple modules", "Multiple users"], correct: 0 },
            { question: "What does 'depends_on' do?", options: ["Creates dependency", "Destroys dependency", "Lists dependencies", "Validates dependencies"], correct: 0 },
            { question: "What is the purpose of terraform.lock.hcl?", options: ["Lock state file", "Lock provider versions", "Lock resources", "Lock modules"], correct: 1 },
            { question: "How do you import existing resources?", options: ["terraform add", "terraform import", "terraform include", "terraform merge"], correct: 1 }
        ],
        aws: [
            { question: "What is an AMI?", options: ["Amazon Machine Image", "Amazon Machine Instance", "Amazon Module Interface", "Amazon Management Interface"], correct: 0 },
            { question: "What is the difference between Security Groups and NACLs?", options: ["Same thing", "SG is stateful, NACL is stateless", "SG is stateless, NACL is stateful", "No difference"], correct: 1 },
            { question: "What is an Auto Scaling Group?", options: ["A load balancer", "A group of EC2 instances that scale automatically", "A database cluster", "A storage group"], correct: 1 },
            { question: "What is the maximum size of an S3 object?", options: ["1 GB", "5 GB", "5 TB", "Unlimited"], correct: 2 },
            { question: "What is Amazon EBS?", options: ["Elastic Block Storage", "Elastic Bean Stalk", "Elastic Backup Service", "Elastic Balance System"], correct: 0 },
            { question: "What are the different types of load balancers in AWS?", options: ["Only Application", "Application, Network, Classic", "Only Network", "Application and Gateway"], correct: 1 },
            { question: "What is AWS CloudFormation?", options: ["Monitoring service", "Infrastructure as Code service", "Database service", "Analytics service"], correct: 1 },
            { question: "What is the difference between horizontal and vertical scaling?", options: ["Same thing", "Horizontal adds instances, Vertical increases instance size", "Horizontal increases size, Vertical adds instances", "No difference"], correct: 1 },
            { question: "What is Amazon SNS?", options: ["Simple Notification Service", "Simple Network Service", "Secure Network System", "Storage Node Service"], correct: 0 },
            { question: "What is the AWS shared responsibility model?", options: ["AWS manages everything", "Customer manages everything", "AWS handles security OF cloud, customer handles security IN cloud", "Shared equally"], correct: 2 }
        ],
        ansible: [
            { question: "What is idempotency in Ansible?", options: ["Running faster", "Same result when run multiple times", "Parallel execution", "Error handling"], correct: 1 },
            { question: "What are Ansible facts?", options: ["User variables", "System information gathered automatically", "Configuration files", "Error logs"], correct: 1 },
            { question: "What is the difference between a playbook and a role?", options: ["Same thing", "Playbook contains tasks, role is reusable structure", "Role contains playbooks", "No difference"], correct: 1 },
            { question: "How do you run a playbook in check mode?", options: ["ansible-playbook --check", "ansible-playbook --dry-run", "ansible-playbook --test", "ansible-playbook --verify"], correct: 0 },
            { question: "What is Ansible Vault?", options: ["Storage system", "Encryption for sensitive data", "Backup tool", "Version control"], correct: 1 },
            { question: "What is a handler in Ansible?", options: ["Error handler", "Task triggered by notify", "User handler", "Network handler"], correct: 1 },
            { question: "How do you limit playbook execution to specific hosts?", options: ["--limit", "--hosts", "--only", "--filter"], correct: 0 },
            { question: "What is the difference between 'copy' and 'template' modules?", options: ["Same thing", "Template processes Jinja2 variables", "Copy is faster", "No difference"], correct: 1 },
            { question: "What is ansible-galaxy?", options: ["Cloud service", "Repository for sharing roles", "Monitoring tool", "Database"], correct: 1 },
            { question: "What does 'gather_facts' do?", options: ["Gathers logs", "Collects system information", "Gathers errors", "Collects metrics"], correct: 1 }
        ],
        docker: [
            { question: "What is the difference between CMD and ENTRYPOINT?", options: ["Same thing", "ENTRYPOINT is not overridable, CMD is", "CMD runs first", "No difference"], correct: 1 },
            { question: "What is a multi-stage build?", options: ["Multiple images", "Building image in multiple stages to reduce size", "Parallel builds", "Version control"], correct: 1 },
            { question: "What is docker-compose used for?", options: ["Build images", "Define and run multi-container applications", "Monitor containers", "Deploy to production"], correct: 1 },
            { question: "What is the difference between COPY and ADD in Dockerfile?", options: ["Same thing", "ADD has extra features like URL and tar extraction", "COPY is faster", "No difference"], correct: 1 },
            { question: "What is Docker networking?", options: ["Internet connection", "How containers communicate", "Cloud networking", "VPN"], correct: 1 },
            { question: "What are the default Docker networks?", options: ["bridge, host, none", "public, private", "internal, external", "default only"], correct: 0 },
            { question: "What is a Docker registry?", options: ["Configuration store", "Storage for Docker images", "Log storage", "Network registry"], correct: 1 },
            { question: "What does 'docker exec' do?", options: ["Execute image", "Run command in running container", "Execute build", "Run new container"], correct: 1 },
            { question: "What is the purpose of .dockerignore?", options: ["Ignore errors", "Exclude files from build context", "Ignore warnings", "Skip tests"], correct: 1 },
            { question: "What is Docker Swarm?", options: ["Image builder", "Native clustering and orchestration", "Monitoring tool", "Registry"], correct: 1 }
        ],
        kubernetes: [
            { question: "What is the difference between a Deployment and a StatefulSet?", options: ["Same thing", "StatefulSet maintains pod identity and order", "Deployment is newer", "No difference"], correct: 1 },
            { question: "What is a ConfigMap?", options: ["Configuration backup", "Store non-sensitive configuration data", "Cluster map", "Network configuration"], correct: 1 },
            { question: "What is a Secret in Kubernetes?", options: ["Hidden feature", "Store sensitive information", "Private network", "Encrypted storage"], correct: 1 },
            { question: "What is an Ingress?", options: ["Pod entry point", "Manages external access to services", "Network plugin", "Storage class"], correct: 1 },
            { question: "What is a DaemonSet?", options: ["Daemon process", "Ensures pod runs on all nodes", "Background service", "System daemon"], correct: 1 },
            { question: "What is the purpose of a ReplicaSet?", options: ["Backup pods", "Maintain desired number of pod replicas", "Replicate data", "Clone services"], correct: 1 },
            { question: "What is a PersistentVolume?", options: ["Temporary storage", "Piece of storage in cluster", "Pod storage", "Image storage"], correct: 1 },
            { question: "What is the difference between a ClusterIP and NodePort service?", options: ["Same thing", "ClusterIP is internal only, NodePort exposes on node", "NodePort is faster", "No difference"], correct: 1 },
            { question: "What is a Helm chart?", options: ["Monitoring chart", "Package manager for Kubernetes", "Network chart", "Performance graph"], correct: 1 },
            { question: "What is kubectl apply vs kubectl create?", options: ["Same thing", "Apply is declarative, create is imperative", "Create is newer", "No difference"], correct: 1 }
        ],
        git: [
            { question: "What is the difference between 'git pull' and 'git fetch'?", options: ["Same thing", "Pull fetches and merges, fetch only downloads", "Fetch is faster", "No difference"], correct: 1 },
            { question: "What does 'git rebase' do?", options: ["Deletes commits", "Reapplies commits on top of another branch", "Creates backup", "Resets branch"], correct: 1 },
            { question: "What is a merge conflict?", options: ["Server error", "When changes conflict during merge", "Branch error", "Commit error"], correct: 1 },
            { question: "What is 'git stash' used for?", options: ["Delete changes", "Temporarily save uncommitted changes", "Create backup", "Archive commits"], correct: 1 },
            { question: "What is the difference between 'git merge' and 'git rebase'?", options: ["Same thing", "Merge creates merge commit, rebase rewrites history", "Rebase is faster", "No difference"], correct: 1 },
            { question: "What is a remote in Git?", options: ["Cloud storage", "Reference to another repository", "Backup location", "Remote server"], correct: 1 },
            { question: "What does 'git cherry-pick' do?", options: ["Delete commit", "Apply specific commit to current branch", "Pick files", "Select branches"], correct: 1 },
            { question: "What is HEAD in Git?", options: ["First commit", "Pointer to current branch/commit", "Main branch", "Remote branch"], correct: 1 },
            { question: "What is .gitignore file?", options: ["Ignored commits", "Specifies files to ignore", "Deleted files list", "Error log"], correct: 1 },
            { question: "What is 'git reset' used for?", options: ["Reset password", "Undo commits and changes", "Reset repository", "Restart Git"], correct: 1 }
        ]
    },
    advanced: {
        linux: [
            { question: "What is the difference between hard and soft links?", options: ["Same thing", "Hard link points to inode, soft link points to filename", "Soft is faster", "No difference"], correct: 1 },
            { question: "What is SELinux?", options: ["Shell", "Security-Enhanced Linux (MAC system)", "Package manager", "File system"], correct: 1 },
            { question: "What is a daemon process?", options: ["Virus", "Background service process", "User process", "System command"], correct: 1 },
            { question: "What is the purpose of /proc filesystem?", options: ["Store programs", "Virtual filesystem for process info", "Store logs", "Configuration files"], correct: 1 },
            { question: "What is iptables used for?", options: ["Table management", "Packet filtering and NAT", "Database tables", "Process tables"], correct: 1 },
            { question: "What is the difference between TCP and UDP?", options: ["Same protocol", "TCP is connection-oriented, UDP is connectionless", "UDP is newer", "No difference"], correct: 1 },
            { question: "What is kernel panic?", options: ["User error", "Fatal system error", "Warning message", "Performance issue"], correct: 1 },
            { question: "What is LVM?", options: ["Log Volume Manager", "Logical Volume Manager", "Linux Virtual Machine", "Local Volume Mount"], correct: 1 },
            { question: "What is the difference between /dev/sda and /dev/sda1?", options: ["Same device", "sda is disk, sda1 is partition", "Different disks", "sda1 is backup"], correct: 1 },
            { question: "What is systemd?", options: ["System command", "Init system and service manager", "Daemon process", "Configuration tool"], correct: 1 }
        ],
        terraform: [
            { question: "What is the purpose of terraform remote state?", options: ["Backup state", "Share state across team", "Delete state", "Version state"], correct: 1 },
            { question: "How do you handle sensitive data in Terraform?", options: ["Plain text", "Use sensitive flag and secret managers", "Encrypt files", "Hide variables"], correct: 1 },
            { question: "What is terraform taint used for?", options: ["Mark resource dirty", "Mark resource for recreation", "Delete resource", "Validate resource"], correct: 1 },
            { question: "What is the purpose of provisioners?", options: ["Provision cloud", "Execute scripts on resource creation", "Create providers", "Manage state"], correct: 1 },
            { question: "What is dynamic block in Terraform?", options: ["Moving block", "Generate nested blocks dynamically", "Type of resource", "State block"], correct: 1 },
            { question: "How does terraform handle dependencies?", options: ["Manual only", "Implicit and explicit dependencies", "No dependencies", "Random order"], correct: 1 },
            { question: "What is count vs for_each?", options: ["Same thing", "count uses index, for_each uses keys", "for_each is older", "No difference"], correct: 1 },
            { question: "What is terraform state locking?", options: ["Lock files", "Prevent concurrent state modifications", "Lock resources", "Secure state"], correct: 1 },
            { question: "What are terraform backends?", options: ["Background processes", "Where state is stored", "Database backends", "API backends"], correct: 1 },
            { question: "How do you upgrade terraform providers safely?", options: ["Delete and reinstall", "Use terraform init -upgrade", "Manual update", "Auto-update"], correct: 1 }
        ],
        aws: [
            { question: "What is the difference between ephemeral and persistent storage?", options: ["Same thing", "Ephemeral is temporary, persistent survives restarts", "Persistent is faster", "No difference"], correct: 1 },
            { question: "What is AWS Organizations used for?", options: ["Organize files", "Centrally manage multiple AWS accounts", "Organize users", "Organize resources"], correct: 1 },
            { question: "What is the difference between AWS Config and CloudTrail?", options: ["Same service", "Config tracks resource config, CloudTrail tracks API calls", "CloudTrail is newer", "No difference"], correct: 1 },
            { question: "What is AWS PrivateLink?", options: ["Private network", "Access services privately without public internet", "VPN service", "Direct Connect"], correct: 1 },
            { question: "What is the Well-Architected Framework?", options: ["Building design", "Best practices for cloud architecture", "Database framework", "Network framework"], correct: 1 },
            { question: "What is the difference between spot, on-demand, and reserved instances?", options: ["Same pricing", "Different pricing and commitment models", "Spot is faster", "No difference"], correct: 1 },
            { question: "What is AWS Systems Manager?", options: ["System monitor", "Operational data and automation service", "Database system", "File system"], correct: 1 },
            { question: "How does AWS KMS work?", options: ["Key storage", "Managed encryption key service", "Monitoring service", "Database service"], correct: 1 },
            { question: "What is the difference between ALB and NLB?", options: ["Same load balancer", "ALB is Layer 7, NLB is Layer 4", "NLB is older", "No difference"], correct: 1 },
            { question: "What is AWS Transit Gateway?", options: ["VPN gateway", "Connects VPCs and on-premises networks", "Internet gateway", "NAT gateway"], correct: 1 }
        ],
        ansible: [
            { question: "How do you implement rolling updates in Ansible?", options: ["Manual process", "Use serial and max_fail_percentage", "Not possible", "Use parallel"], correct: 1 },
            { question: "What is Ansible Tower/AWX?", options: ["Ansible version", "Web UI and API for Ansible", "Cloud service", "Database"], correct: 1 },
            { question: "How do you optimize Ansible performance?", options: ["Use faster servers", "Pipelining, forks, async tasks", "Cannot optimize", "Use more memory"], correct: 1 },
            { question: "What is the difference between include and import?", options: ["Same thing", "include is dynamic, import is static", "import is newer", "No difference"], correct: 1 },
            { question: "How do you test Ansible playbooks?", options: ["Manual testing", "Molecule, syntax check, --check mode", "Cannot test", "Production testing"], correct: 1 },
            { question: "What is Ansible callback plugin?", options: ["Network callback", "Customizes output and logging", "Error handler", "API callback"], correct: 1 },
            { question: "How do you handle secrets management at scale?", options: ["Plain text files", "Ansible Vault with external secret managers", "Environment variables", "No secrets"], correct: 1 },
            { question: "What is the purpose of ansible.cfg?", options: ["Store playbooks", "Configure Ansible behavior", "Store variables", "Store inventory"], correct: 1 },
            { question: "How do you debug Ansible playbooks?", options: ["Print statements", "debug module, -vvv flag, debugger", "Cannot debug", "Trial and error"], correct: 1 },
            { question: "What are custom Ansible modules?", options: ["Pre-built modules", "User-written modules for specific tasks", "Cloud modules", "Database modules"], correct: 1 }
        ],
        docker: [
            { question: "What is BuildKit in Docker?", options: ["Build tool", "Next-generation build system", "Image builder", "Container builder"], correct: 1 },
            { question: "How do you reduce Docker image size?", options: ["Compress images", "Multi-stage builds, minimize layers, use alpine", "Cannot reduce", "Delete files"], correct: 1 },
            { question: "What is the difference between bridge and overlay networks?", options: ["Same network", "Bridge for single host, overlay for multi-host", "Overlay is faster", "No difference"], correct: 1 },
            { question: "What is Docker content trust?", options: ["Trust policy", "Image signing and verification", "Container trust", "Network trust"], correct: 1 },
            { question: "How do you implement health checks in Docker?", options: ["Manual checks", "HEALTHCHECK instruction in Dockerfile", "External monitoring", "No health checks"], correct: 1 },
            { question: "What is the difference between bridge driver and host driver?", options: ["Same driver", "Bridge isolates network, host uses host network", "Host is faster", "No difference"], correct: 1 },
            { question: "What are Docker build arguments vs environment variables?", options: ["Same thing", "ARG is build-time, ENV is runtime", "ENV is build-time", "No difference"], correct: 1 },
            { question: "How do you secure Docker containers?", options: ["Use passwords", "Least privilege, scanning, secrets management", "Cannot secure", "Encryption only"], correct: 1 },
            { question: "What is Docker layer caching?", options: ["Memory cache", "Reuses unchanged layers in builds", "Disk cache", "Network cache"], correct: 1 },
            { question: "What is the purpose of Docker namespaces?", options: ["Name containers", "Isolate container resources", "Organize images", "Network namespaces"], correct: 1 }
        ],
        kubernetes: [
            { question: "What is the Kubernetes control plane?", options: ["User interface", "Components managing cluster state", "Network plane", "Data plane"], correct: 1 },
            { question: "What is etcd in Kubernetes?", options: ["Container runtime", "Distributed key-value store for cluster data", "Network plugin", "Storage system"], correct: 1 },
            { question: "How does Kubernetes scheduler work?", options: ["Random assignment", "Assigns pods to nodes based on resources and constraints", "Round-robin", "First available"], correct: 1 },
            { question: "What is a Custom Resource Definition (CRD)?", options: ["Custom pod", "Extends Kubernetes API with custom resources", "Custom network", "Custom storage"], correct: 1 },
            { question: "What is the difference between horizontal and vertical pod autoscaling?", options: ["Same thing", "HPA scales replicas, VPA adjusts resource requests", "VPA scales replicas", "No difference"], correct: 1 },
            { question: "What is a Service Mesh?", options: ["Network mesh", "Infrastructure layer for service-to-service communication", "Load balancer", "Service discovery"], correct: 1 },
            { question: "What is the purpose of admission controllers?", options: ["Admit users", "Intercept and validate/mutate API requests", "Control access", "Manage admissions"], correct: 1 },
            { question: "How do you implement blue-green deployments in Kubernetes?", options: ["Color coding", "Multiple deployments with service switching", "Built-in feature", "Not possible"], correct: 1 },
            { question: "What is the Kubernetes API server?", options: ["Web server", "Central management point for cluster", "Database server", "Application server"], correct: 1 },
            { question: "What is network policy in Kubernetes?", options: ["Network configuration", "Firewall rules for pod communication", "Network speed", "Network monitoring"], correct: 1 }
        ],
        git: [
            { question: "What is git reflog?", options: ["Reflection log", "Reference log of HEAD movements", "Error log", "Commit log"], correct: 1 },
            { question: "What is the difference between git reset --soft, --mixed, and --hard?", options: ["Same command", "Different levels of undo: soft keeps changes, hard discards", "hard is faster", "No difference"], correct: 1 },
            { question: "What is git bisect used for?", options: ["Split repository", "Binary search to find bug-introducing commit", "Divide commits", "Branch splitting"], correct: 1 },
            { question: "What are git hooks?", options: ["Fishing hooks", "Scripts triggered by git events", "Branch hooks", "Commit hooks"], correct: 1 },
            { question: "What is the difference between git merge --squash and regular merge?", options: ["Same merge", "Squash combines commits into one", "Squash is faster", "No difference"], correct: 1 },
            { question: "What is git submodule?", options: ["Sub-branch", "Repository inside another repository", "Module system", "Partial repository"], correct: 1 },
            { question: "How do you recover a deleted branch?", options: ["Cannot recover", "Use reflog to find commit and recreate", "Restore from backup", "Use git recover"], correct: 1 },
            { question: "What is git worktree?", options: ["Working directory", "Multiple working directories for one repository", "Tree structure", "Branch tree"], correct: 1 },
            { question: "What is the purpose of git clean?", options: ["Clean code", "Remove untracked files", "Clean history", "Clean branches"], correct: 1 },
            { question: "What is interactive rebase?", options: ["Interactive mode", "Edit, reorder, squash commits interactively", "Chat interface", "GUI tool"], correct: 1 }
        ]
    }
};

const extraQuestionBank = {
  easy: {
    sre: [
      { question: "Which of these is a Service Level Indicator (SLI)?", options: ["A promise written into a contract", "The measured percentage of successful requests", "A quarterly project target", "A list of on-call engineers"], correct: 1, explanation: "An SLI is a measured indicator of user-facing service behaviour, such as availability, latency, or successful request rate." },
      { question: "What does an SLO define?", options: ["The exact cause of every incident", "A cloud provider's invoice", "A target for an SLI over a defined window", "A list of deployment steps"], correct: 2, explanation: "A Service Level Objective sets a target for an SLI over a time window, for example 99.9% successful requests over 30 days." },
      { question: "What is an error budget?", options: ["The unreliability permitted by an SLO", "Money reserved for new features", "The count of open bugs", "The time allocated to code review"], correct: 0, explanation: "The error budget is the portion of the SLO's allowed failure or latency that remains available before the objective is missed." },
      { question: "What is the main purpose of a blameless post-incident review?", options: ["Find one person to punish", "Understand contributing conditions and prevent recurrence", "Avoid documenting incidents", "Prove that monitoring is unnecessary"], correct: 1, explanation: "Blameless reviews examine system conditions, decisions, tooling, and process so teams can make concrete reliability improvements." }
    ],
    observability: [
      { question: "Which signal is best suited to showing CPU utilization over time?", options: ["A metric", "A full request trace", "A deployment ticket", "A stack trace only"], correct: 0, explanation: "Metrics are numerical time series and are well suited to monitoring resource use and trends over time." },
      { question: "What do application logs primarily provide?", options: ["A guaranteed replica of every packet", "Structured or unstructured records of events", "A replacement for deployment automation", "Only CPU percentages"], correct: 1, explanation: "Logs record discrete events and their context, helping explain what happened around a failure." },
      { question: "What does distributed tracing help you follow?", options: ["Only the VM boot sequence", "A single disk's free space", "A request as it moves across services", "The age of a container image"], correct: 2, explanation: "A distributed trace links spans across services, making cross-service latency and failure paths easier to investigate." },
      { question: "A service has p95 latency of 400 ms. What does that mean?", options: ["Every request takes exactly 400 ms", "95% of measured requests completed in 400 ms or less", "5% of requests failed", "The service handles 400 requests per second"], correct: 1, explanation: "The 95th percentile is a latency threshold at or below which 95% of observations fall; it is not an average or an error rate." }
    ],
    systems: [
      { question: "Which command shows filesystem free space in human-readable units?", options: ["du -sh /", "df -h", "free -m", "ps aux"], correct: 1, explanation: "df reports space available on mounted filesystems; -h formats values using readable units." },
      { question: "Which command checks the current state of a systemd service?", options: ["systemctl status nginx", "chmod nginx", "lsmod nginx", "mount nginx"], correct: 0, explanation: "systemctl status shows the unit state and recent service log lines for a systemd-managed service." },
      { question: "How can you inspect recent logs for a systemd service named nginx?", options: ["ip link nginx", "journalctl -u nginx", "fdisk -l nginx", "whoami nginx"], correct: 1, explanation: "journalctl -u filters the systemd journal to entries associated with the named unit; add -f to follow new entries." },
      { question: "Which command gives a quick summary of memory and swap usage?", options: ["free -h", "df -i", "ss -s", "chmod -l"], correct: 0, explanation: "free summarizes memory and swap. On Linux, the available column is usually more useful than treating all cache as unavailable memory." }
    ],
    networking: [
      { question: "Which command-line tool can query DNS records?", options: ["dig", "chmod", "top", "tar"], correct: 0, explanation: "dig queries DNS and shows the response, answer records, resolver, and timing details." },
      { question: "Which command can list listening TCP sockets with numeric ports and process details on Linux?", options: ["df -h", "ss -lntp", "free -h", "uname -a"], correct: 1, explanation: "ss -lntp lists listening TCP sockets, displays numeric addresses, and attempts to show the owning process; elevated privileges may reveal more process details." },
      { question: "What does HTTP status 503 normally indicate?", options: ["The resource moved permanently", "The client is unauthenticated", "The service is temporarily unavailable", "The request succeeded with no body"], correct: 2, explanation: "503 Service Unavailable commonly indicates temporary overload, maintenance, or lack of healthy service capacity." },
      { question: "What does curl -I request by default?", options: ["Response headers using an HTTP HEAD request", "A full packet capture", "A DNS zone transfer", "A new TLS certificate"], correct: 0, explanation: "curl -I issues a HEAD request and displays response headers without requesting the response body in the usual HTTP case." }
    ]
  },
  medium: {
    sre: [
      { question: "What does a high error-budget burn rate tell an SRE team?", options: ["Cloud costs are rising", "The service is consuming allowed unreliability faster than its target pace", "No alerts can fire", "Every request is successful"], correct: 1, explanation: "Burn rate compares the observed error rate with the rate compatible with the SLO. A high value warns that the budget may be exhausted early." },
      { question: "Which target is stricter over the same measurement window?", options: ["99% availability", "99.9% availability", "99.99% availability", "All allow the same downtime"], correct: 2, explanation: "A 99.99% objective allows one tenth as much unavailability as 99.9% over the same window." },
      { question: "What does MTTD measure?", options: ["Mean Time To Detect a problem", "Maximum Traffic To Deploy", "Mean Time To Delete data", "Monthly Test Duration"], correct: 0, explanation: "MTTD measures how long it takes to detect a problem; MTTR measures recovery or repair time, with the precise R expansion defined by the team." },
      { question: "Which alert is generally more actionable for an application team?", options: ["A host name has changed", "A user-facing latency SLO is being violated", "A log line contains the word warning", "CPU briefly moved by one percentage point"], correct: 1, explanation: "Symptom-based alerts tied to user impact or SLOs help teams respond to real service degradation rather than noisy internal signals." }
    ],
    observability: [
      { question: "What does the RED method commonly track for a service?", options: ["Rate, Errors, Duration", "RAM, Ethernet, Disk", "Requests, Encryption, DNS", "Recovery, Events, Deployment"], correct: 0, explanation: "RED focuses on request rate, error rate, and duration/latency for request-driven services." },
      { question: "Why should user IDs usually not be Prometheus metric labels?", options: ["Labels only accept integers", "They create high cardinality and can overwhelm storage", "Prometheus cannot store strings anywhere", "Labels are automatically encrypted"], correct: 1, explanation: "Every unique label-value combination creates a time series. Unbounded values such as user IDs can cause a cardinality explosion." },
      { question: "Why use a histogram for request latency?", options: ["It proves that no request failed", "It stores complete logs inside each time series", "It supports aggregatable latency distributions and percentile estimates", "It removes the need for sampling"], correct: 2, explanation: "Histogram buckets can be aggregated across instances and used to estimate quantiles; they do not preserve every individual observation." },
      { question: "Several services are slow, but host metrics look normal. What is the most useful next signal for a single affected request?", options: ["A distributed trace", "The Linux login banner", "An image tag", "A Git branch name"], correct: 0, explanation: "A distributed trace can show which downstream span or service contributes latency even when infrastructure-wide averages look healthy." }
    ],
    systems: [
      { question: "A filesystem has free bytes but applications cannot create files. Which resource should you check?", options: ["DNS TTL", "Inode availability with df -i", "CPU model with lscpu", "Default route only"], correct: 1, explanation: "A filesystem can run out of inodes before its data blocks are full. df -i reports inode use." },
      { question: "Which setting commonly limits how many file descriptors a process can open?", options: ["ulimit -n", "umask -n", "nice -n", "hostname -n"], correct: 0, explanation: "ulimit -n reports or sets the shell's open-file descriptor limit; systemd services may also need LimitNOFILE configuration." },
      { question: "A Linux process was killed due to memory pressure. Which evidence is a useful first check?", options: ["The system DNS search domain only", "Kernel logs for OOM-killer messages", "The Git remote URL", "The terminal color theme"], correct: 1, explanation: "Kernel logs, commonly queried with journalctl -k or dmesg, can identify OOM-killer events and the process selected." },
      { question: "What does load average represent on Linux?", options: ["CPU utilization percentage only", "The number of users logged in", "Runnable and uninterruptible tasks averaged over time", "Free disk space in GB"], correct: 2, explanation: "Linux load average includes runnable tasks and tasks in uninterruptible sleep, often I/O wait; compare it with CPU count and other metrics." }
    ],
    networking: [
      { question: "What is the typical difference between connection refused and a connection timeout?", options: ["They always mean the same thing", "Refused often means a reachable host rejected/no listener; timeout means no timely response", "Timeout proves the application returned HTTP 500", "Refused always means DNS failed"], correct: 1, explanation: "A refusal is often an immediate TCP reset or rejection; a timeout can indicate packet filtering, routing loss, or an unresponsive endpoint." },
      { question: "Why can a DNS change appear inconsistent during a migration?", options: ["DNS records never have TTLs", "Resolvers and clients may cache answers until their TTLs expire", "TCP ignores DNS", "The IP address is stored in the TLS certificate"], correct: 1, explanation: "Resolvers and applications may keep cached DNS answers for their TTL, so different clients can switch over at different times." },
      { question: "Which command can inspect a TLS certificate presented by a server?", options: ["openssl s_client -connect example.com:443 -servername example.com", "df -h", "terraform fmt", "ansible-inventory --graph"], correct: 0, explanation: "openssl s_client can perform a TLS handshake and display certificate-chain details. Supply -servername to send the expected SNI host." },
      { question: "Which command shows the Linux kernel's routing table in a modern iproute2 environment?", options: ["ip route", "ip user", "ip account", "ip service"], correct: 0, explanation: "ip route lists routes and helps confirm the next hop/interface the kernel would use for traffic." }
    ]
  },
  mediumHard: {
    sre: [
      { question: "A service's 30-day availability SLO is 99.9%. Approximately how much unavailability does that budget permit in a 30-day window?", options: ["About 43 minutes", "About 7.2 hours", "About 3 days", "No downtime at all"], correct: 0, explanation: "A 30-day window contains 43,200 minutes; 0.1% of that is 43.2 minutes. The actual SLO calculation must use the service's defined measurement rules." },
      { question: "A multi-window, multi-burn-rate alert is designed mainly to do what?", options: ["Replace all incident response", "Detect fast or sustained SLO-budget consumption with better noise control", "Measure cloud spend only", "Ensure every error is retried"], correct: 1, explanation: "Using short and long windows helps detect urgent and sustained budget burn while reducing alerts triggered by very brief spikes." },
      { question: "Who should primarily coordinate roles, priorities, and communication during a major incident?", options: ["The incident commander", "The database connection pool", "The build cache", "The DNS resolver"], correct: 0, explanation: "An incident commander coordinates the response and maintains shared situational awareness; technical leads and communications roles can operate in parallel." },
      { question: "Which is the strongest postmortem action item?", options: ["Improve reliability soon", "Remind everyone to be careful", "Add an owned, testable change with a due date and a way to verify it", "Close the report without follow-up"], correct: 2, explanation: "Effective actions have a clear owner, measurable outcome, and a verification plan, preferably addressing systemic causes rather than relying on memory." }
    ],
    observability: [
      { question: "In Prometheus, why use rate() on a counter before alerting on requests per second?", options: ["It converts the counter's increase over time into a per-second rate and handles resets", "It encrypts the metric", "It converts all labels to logs", "It guarantees zero missing samples"], correct: 0, explanation: "rate() estimates per-second counter increase over a range and accounts for counter resets; choose a range appropriate to scrape interval and alert latency." },
      { question: "Why can a p95 latency estimate from per-instance summaries be difficult to aggregate correctly?", options: ["Summaries cannot represent latency", "Percentiles are generally not composable by averaging instance quantiles", "They always have zero labels", "They record only HTTP status codes"], correct: 1, explanation: "You generally cannot average per-instance p95 values to obtain a fleet-wide p95. Aggregatable histogram buckets enable a combined quantile estimate." },
      { question: "A Prometheus service suddenly creates millions of time series. What is a likely cause?", options: ["A lower scrape interval always reduces series count", "An unbounded label such as request path, session ID, or user ID", "A missing README", "A stable counter with no labels"], correct: 1, explanation: "Unbounded label values multiply the series count. Normalize paths and avoid unique identifiers as metric labels; use logs or traces for high-cardinality context." },
      { question: "Which alert strategy generally reduces paging on harmless infrastructure fluctuations?", options: ["Page on every warning log", "Page only when a machine reboots", "Alert on sustained user-impact symptoms or meaningful SLO burn", "Page whenever a dashboard is refreshed"], correct: 2, explanation: "Alerts should represent actionable user impact or material risk to objectives. Low-level signals are useful for diagnosis, but not every fluctuation needs a page." }
    ],
    systems: [
      { question: "CPU utilization is low, load average is high, and storage latency is elevated. What should you investigate first?", options: ["Disk or storage I/O stalls and tasks in uninterruptible sleep", "The browser cache", "The TLS certificate expiry only", "Whether the server name contains capitals"], correct: 0, explanation: "Linux load average includes uninterruptible tasks. High storage latency with low CPU can indicate I/O-bound tasks rather than CPU saturation." },
      { question: "A service fails at startup because another unit must already be running. Which systemd concepts should you examine?", options: ["Only the shell prompt", "Unit dependencies such as Requires/Wants and ordering such as After", "Only file ownership of /tmp", "The DNS MX record"], correct: 1, explanation: "systemd separates dependency relationships from ordering. After controls ordering; Requires/Wants express dependency behaviour." },
      { question: "What is log rotation intended to prevent?", options: ["Every log entry from being written", "Logs from consuming unbounded disk space", "The system clock from changing", "Processes from opening sockets"], correct: 1, explanation: "Rotation archives, compresses, and removes old logs according to policy so continuously written logs do not exhaust storage." },
      { question: "What is a useful first source for identifying a Linux kernel OOM kill?", options: ["journalctl -k or dmesg output", "git log --oneline", "terraform output", "dig +trace"], correct: 0, explanation: "Kernel messages often record out-of-memory events and the process that was killed; also inspect cgroup/container memory limits when relevant." }
    ],
    networking: [
      { question: "Large responses fail while small requests work, and the pattern suggests a path MTU issue. What is a reasonable investigation?", options: ["Lower DNS TTL only", "Inspect interface/path MTU and ICMP packet-too-big handling", "Increase the application log level permanently", "Delete the default route"], correct: 1, explanation: "MTU black holes can occur when oversized packets are dropped and path-MTU discovery signals are blocked. Check interface MTUs and relevant ICMP handling." },
      { question: "Why is asymmetric routing a possible problem for stateful firewalls?", options: ["They may see only one direction of a connection and lack the matching state", "It makes every TCP connection encrypted", "It forces DNS to use UDP only", "It removes packet headers"], correct: 0, explanation: "Stateful devices track connection state. If forward and return paths traverse different devices, one device may not see the flow's established state." },
      { question: "Which tool is especially useful for examining TCP handshakes and retransmissions on a Linux host?", options: ["tcpdump", "terraform validate", "free", "ansible-vault"], correct: 0, explanation: "tcpdump captures packets for inspection of SYN/SYN-ACK exchanges, resets, retransmissions, and timing; capture only the traffic needed and handle payloads sensitively." },
      { question: "Repeated outbound connection failures occur only at very high connection rates through NAT. Which limit is worth investigating?", options: ["The number of local user accounts", "Available source/ephemeral ports and NAT connection capacity", "The number of README headings", "The DNS MX priority"], correct: 1, explanation: "High outbound connection churn can exhaust source ports or NAT tracking/capacity. Connection pooling, reuse, and provider limits should be examined alongside packet evidence." }
    ]
  },
  hard: {
    sre: [
      { question: "A service consumes 80% of its error budget in the first 10% of the SLO window. Compared with a steady budget-consumption pace, what is the approximate burn rate?", options: ["0.8x", "1x", "8x", "80x"], correct: 2, explanation: "Steady consumption would use about 10% of the budget in the first 10% of the window. Actual consumption is 80%, so 80 / 10 = an 8x burn rate." },
      { question: "A service has a strict availability SLO but a dependency is failing. Which design response most directly limits cascading failure?", options: ["Retry every failure immediately without limits", "Bound retries, use deadlines, isolate dependencies, and shed load when needed", "Increase all client timeouts indefinitely", "Remove all health checks"], correct: 1, explanation: "Bounded retries, deadlines, bulkheads, circuit breakers, and load shedding prevent one unhealthy dependency from consuming all resources and spreading failure." },
      { question: "Which statement correctly distinguishes RTO and RPO in disaster recovery?", options: ["RTO is tolerated data loss; RPO is recovery time", "RTO is target time to restore service; RPO is the tolerated data-loss window", "Both mean monthly availability", "RTO applies only to backups and RPO only to DNS"], correct: 1, explanation: "Recovery Time Objective is how quickly service should be restored; Recovery Point Objective describes how much data loss in time the business can tolerate." },
      { question: "During an incident, the proposed mitigation restores availability but temporarily disables a non-critical feature. What is the SRE-oriented priority?", options: ["Keep the feature at all costs", "Prefer restoring core user-facing service, communicate trade-offs, then follow up", "Wait for a full root-cause analysis before mitigating", "Hide the degradation from users"], correct: 1, explanation: "Incident response prioritizes mitigation of user impact. A deliberate degradation or feature disablement may be appropriate when it protects the critical path and is communicated and reviewed." }
    ],
    observability: [
      { question: "What is the key trade-off between head-based and tail-based trace sampling?", options: ["Head-based can decide early with lower coordination cost; tail-based can retain traces based on completed trace characteristics", "Both guarantee every trace is retained", "Tail-based sampling works only for metrics", "Head-based sampling removes trace IDs"], correct: 0, explanation: "Head-based sampling decides near the start and is operationally simpler. Tail-based sampling can retain traces with errors or high latency but requires buffering and coordination." },
      { question: "A dashboard has high cardinality because every URL is a distinct label. What is the best remediation?", options: ["Increase the scrape interval only", "Normalize dynamic path segments into route templates and move request-specific details to logs/traces", "Add user ID and session ID labels", "Delete the SLO"], correct: 1, explanation: "Route templates such as /orders/{id} keep metric labels bounded. Request-specific IDs belong in logs/traces where they do not create one time series per value." },
      { question: "Which alert query is generally a better error-rate signal than a raw error count when traffic varies?", options: ["The total number of warnings since boot", "Error requests divided by total requests over an appropriate window", "The number of dashboard panels", "The latest container image tag"], correct: 1, explanation: "A ratio normalizes failures against traffic volume. Pair it with adequate request volume, a meaningful window, and an SLO or alert threshold." },
      { question: "What does black-box monitoring tell you that white-box metrics alone may not?", options: ["Whether an externally observed user path actually works from a probe location", "The full source code of a dependency", "That every internal metric is correct", "The root cause of every failed request automatically"], correct: 0, explanation: "Black-box probes test externally visible behaviour, including DNS, TLS, and request success. They complement internal metrics, logs, and traces rather than replacing them." }
    ],
    systems: [
      { question: "A server's load average is far above its CPU count, but CPU utilization is not saturated. What is a high-value next step?", options: ["Investigate blocked tasks, I/O latency, and process states using vmstat, iostat, and process diagnostics", "Immediately double CPU without evidence", "Assume DNS is the cause", "Delete old user accounts"], correct: 0, explanation: "High load with available CPU can result from tasks blocked on I/O or other uninterruptible waits. Correlate process states, vmstat, iostat, pressure metrics, and service latency before changing capacity." },
      { question: "A process repeatedly hits its open-file limit after running for hours. Which pattern best supports a file-descriptor leak?", options: ["The process has no network listeners", "Open descriptor counts grow over time and do not fall after work completes", "The system hostname changes", "The filesystem's block usage remains constant"], correct: 1, explanation: "A leak often shows a steadily growing descriptor count. Inspect /proc/<pid>/fd, lsof, application connection lifecycle, and configured limits before raising the limit." },
      { question: "A container is OOM-killed even though the host still has free memory. What should you check?", options: ["Only the host's total RAM", "The container's cgroup memory limit and kernel/container OOM events", "The user's Git aliases", "Whether the system uses IPv6"], correct: 1, explanation: "A container can exceed its own cgroup memory limit while the host still has available RAM. Inspect container limits, cgroup counters, workload memory, and kernel events." },
      { question: "A Linux service starts manually but fails after reboot. Which investigation is most appropriate?", options: ["Check its systemd unit, dependencies, environment, permissions, and boot-time journal", "Change every file to mode 777", "Disable all network services", "Clear the DNS cache only"], correct: 0, explanation: "Boot differs from an interactive shell in ordering and environment. Inspect systemctl status, journalctl -b -u service, unit configuration, dependencies, and required mounts/secrets." }
    ],
    networking: [
      { question: "A stateful firewall logs outbound SYN packets, but return traffic uses a different network path and is dropped. Which issue best fits?", options: ["Asymmetric routing and missing connection state on the return path", "A missing MX record", "An oversized Docker image", "An inode leak"], correct: 0, explanation: "A stateful firewall expects to observe the connection and track its state. Asymmetric paths can bypass that state; validate routes, zones, and firewall visibility in both directions." },
      { question: "You plan a DNS migration with a low TTL, but some clients keep using the old endpoint beyond that TTL. What is the most robust plan?", options: ["Assume all clients obey TTL exactly", "Allow for resolver/application caching, validate both endpoints, and use an overlap period with monitoring", "Delete the old endpoint immediately before changing DNS", "Change the TLS private key to force DNS refresh"], correct: 1, explanation: "TTL is not a universal guarantee because applications and resolvers may cache differently. Keep old and new paths safe during transition and validate traffic before retirement." },
      { question: "TLS connections fail only for a specific hostname when several services share one IP. What should you inspect first?", options: ["SNI and the certificate/virtual-host selection for that hostname", "Disk inode count only", "The Terraform state serial only", "The process's nice value"], correct: 0, explanation: "Server Name Indication lets a client identify the hostname during the TLS handshake. Incorrect SNI routing or certificate configuration can break one hostname while others work." },
      { question: "A high-throughput client opens a new TCP connection for every request and intermittently cannot connect through a NAT. Which change is a strong candidate after confirming port/capacity pressure?", options: ["Use bounded connection pooling/keep-alive and control concurrency", "Disable all timeouts", "Retry immediately forever", "Increase DNS TTL to a year"], correct: 0, explanation: "Connection reuse reduces handshake and ephemeral-port churn. Pair pooling with sensible timeouts, concurrency limits, and bounded retries; confirm NAT and OS limits with telemetry." }
    ]
  }
};
function mergeQuestionGroups(base, extra) {
  const merged = {};
  Object.keys(base || {}).forEach(function (topic) { merged[topic] = base[topic].slice(); });
  Object.keys(extra || {}).forEach(function (topic) { merged[topic] = (merged[topic] || []).concat(extra[topic]); });
  return merged;
}
function splitAdvancedQuestions(half) {
  const result = {};
  Object.keys(legacyQuestionBank.advanced).forEach(function (topic) {
    result[topic] = legacyQuestionBank.advanced[topic].slice(half === 0 ? 0 : 5, half === 0 ? 5 : 10);
  });
  return result;
}
const questionBank = {
  easy: mergeQuestionGroups(legacyQuestionBank.beginner, extraQuestionBank.easy),
  medium: mergeQuestionGroups(legacyQuestionBank.intermediate, extraQuestionBank.medium),
  mediumHard: mergeQuestionGroups(splitAdvancedQuestions(0), extraQuestionBank.mediumHard),
  hard: mergeQuestionGroups(splitAdvancedQuestions(1), extraQuestionBank.hard)
};
root.DevOpsQuizBank = questionBank;
if (typeof module !== "undefined" && module.exports) module.exports = questionBank;

})(typeof window !== "undefined" ? window : globalThis);
