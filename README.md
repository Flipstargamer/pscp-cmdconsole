# PSCP CmdConsole
PSCP CmdConsole is a console that provides the ability to run commands. This is mostly based on Cmdr, a command line tool for Roblox.

# Installation
The source code is divided into folders which are named after where they should be put. Each file should be placed in seperate files preferably under the same name. Once everything has installed either run all the files in HooksStarted or restart the server.

## Permission Levels
The file ```Permissions``` has a few permissions made for you, but you need to give the server owner a specific permission. In that file replace OWNER_ID with the owner's Roblox ID. Feel free to change the permission levels to what you desire.

# Licensing
The message that indicates that this was made by Flipstargamer and is licensed under the MIT License needs to be kept.

# Custom Commands
To create custom commands you need to call CommandService.AddCommand() in the Commands Script. An example of a custom command.
```js
CommandService.AddCommand({
  Name = "example", // The name of the command. Needs to be lower case.
  Level = 0, // Minimum level required to run this command.
  Aliases = {"example2"} // Additional list of what needs to be typed in order to execute the command.
  ArgInfo = "[info]" // Optional. Info about the arguments that should be provided.
  Description = "An example command." // A description of what the command does.

  Execute = function(Context, Args) {
    return "This is an example command." // Returning outputs it as a log under the console.
  }
})
```

## Command Context
This gives info about the command and how it was executed aswell as helper functions.

Property List:
* Executor - The player who executed the command.
* Command - The command object.
* CommandInput - The string that was used to run the command.

Method List:
* Send(Text: string) - Sends a message to the console as a log.
* Error(Text: string) - Sends a message to the console as a error.

# Issues/Bug Reports
Found a bug in the command console or want to suggest a feature, feel free to create an issue on this Github repo.

# Contributing
Want to contribute to this project, feel free to fork and create a pull request.
