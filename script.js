// Simulated file system structure
const fileSystem = {
    "/": {
        "Projects": {
            "ELSL_Glove.txt": "https://github.com/Laith-lab",
            "Mp3Player.txt": "https://github.com/Laith-lab",
            "TheLibrary.txt": "https://github.com/Laith-lab",
            "Whackomole.txt": "https://github.com/Laith-lab/pico-whack"
        },
        "Notes": {
            "notes.txt": "https://github.com/Laith-lab"
        },
        "Blog": {
            "blog.txt": "laithweb.pages.dev"
            
        },
        "Contacts": {
            "Github - Laith-lab": "https://github.com/Laith-lab",
            "Email": "lake.ghandour@gmail.com"
        },
    },
    "/Projects": {
        "ELSL_Glove.txt": "https://github.com/Laith-lab",
            "Mp3Player.txt": "https://github.com/Laith-lab",
            "TheLibrary.txt": "https://github.com/Laith-lab",
            "Whackomole.txt": "https://github.com/Laith-lab/pico-whack"
    },
    "/Notes": {
        "notes.txt": "https://github.com/Laith-lab"
    },
    "/Blog": {
        "blog.txt": "https://laithweb.pages.dev"
        
    },
    "/Contacts": {
        "Github - Laith-lab": "https://github.com/Laith-lab",
        "Email": "lake.ghandour@gmail.com"
    },
};

// Starting directory
let currentDirectory = "/";

document.getElementById("terminalInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        // Get the user input and clear the input field
        let input = this.value.trim();
        this.value = '';

        // Display the typed command in the terminal
        let outputDiv = document.getElementById("output");
        let commandOutput = document.createElement("div");
        commandOutput.innerHTML = `<span class="prompt">laith@TubiOS:${currentDirectory}$</span> ${input}`;
        outputDiv.appendChild(commandOutput);

        // Split input into command and arguments
        let inputParts = input.split(" ");
        let command = inputParts[0];
        let argument = inputParts[1];

        // Handle different commands
        if (command === 'ls') {
            // List directory contents
            listDirectory(currentDirectory, outputDiv);
        } else if (command === 'cd') {
            // Change directory
            changeDirectory(argument, outputDiv);
        } else if (command === 'nano') {
            // Open a file in 'nano' (new link)
            openFile(argument, outputDiv);
        } else if (command === 'clear') {
            // Clear the terminal output
            outputDiv.innerHTML = '';
            return;
        } else if (command == 'help') {
            showHelp(outputDiv);


        }   else {
            // Command not found
            let resultOutput = document.createElement("div");
            resultOutput.innerText = `bash: ${input}: command not found`;
            outputDiv.appendChild(resultOutput);
        }

        // Scroll to the bottom to always see the latest input
        document.getElementById("terminal").scrollTop = document.getElementById("terminal").scrollHeight;
    }
});

// Function to list directory contents
function listDirectory(path, outputDiv) {
    let resultOutput = document.createElement("div");

    if (fileSystem[path]) {
        let contents = Object.keys(fileSystem[path]).join("  ");
        resultOutput.innerText = contents || "(empty directory)";
    } else {
        resultOutput.innerText = `bash: ls: cannot access '${path}': No such directory`;
    }

    outputDiv.appendChild(resultOutput);
}

// Function to change directory
function changeDirectory(path, outputDiv) {
    let resultOutput = document.createElement("div");

    if (path === "..") {
        // Move up one level (handle root separately to avoid leaving it)
        if (currentDirectory !== "/") {
            currentDirectory = "/";
        }
    } else if (fileSystem[currentDirectory] && fileSystem[currentDirectory][path] && typeof fileSystem[currentDirectory][path] === "object") {
        // Move into the directory
        currentDirectory = currentDirectory === "/" ? `/${path}` : `${currentDirectory}/${path}`;
    } else {
        resultOutput.innerText = `bash: cd: ${path}: No such directory`;
        outputDiv.appendChild(resultOutput);
        return;
    }

    // Print current directory change
    outputDiv.appendChild(resultOutput);
}

// Function to open a file with nano (link to file)
function openFile(fileName, outputDiv) {
    let resultOutput = document.createElement("div");

    // Check if file exists in the current directory
    if (fileSystem[currentDirectory] && fileSystem[currentDirectory][fileName]) {
        // Open the file's URL in a new tab
        window.open(fileSystem[currentDirectory][fileName], '_blank');
    } else {
        resultOutput.innerText = `bash: nano: ${fileName}: No such file`;
    }

    outputDiv.appendChild(resultOutput);
}


function showHelp(outputDiv) {
    let resultOutput = document.createElement("div");
    resultOutput.innerHTML = `
        <strong>Available commands:</strong><br>
        <strong>ls</strong> - List directory contents<br>
        <strong>cd [directory]</strong> - Change directory<br>
        <strong>nano [filename]</strong> - Open a file in nano (new tab)<br>
        <strong>clear</strong> - Clear the terminal<br>
        <strong>help</strong> - Show this help message<br>
    `;
    outputDiv.appendChild(resultOutput);
}
