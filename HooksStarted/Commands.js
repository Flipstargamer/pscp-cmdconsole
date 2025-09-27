var CommandService = require("CommandService")

CommandService.CleanCommands()

CommandService.AddCommand({
	Name = "help",
	Level = 0,
	Aliases = {"cmds", "ineedhelp"},
	ArgInfo = "[command]",
	Description = "Returns a list of commands.",
	
	Execute = function(Context, Args) {
		if (Args[1]) {
			var Command = CommandService.GetCommand(Args[1])
			
			if (!Command) {
				Context:Error(`{Args[1]} was not found. Aliases are not permitted here.`)
				return;
			}
			
			Context:Send(`{Command.Name} {Command.ArgInfo or ""}`)
			Context:Send(`{Command.Description or "No description has been provided."}`)
			Context:Send(`Permission Requirement: {Command.Level}`)
			
			if (Command.Aliases) {
				var Aliases = Command.Aliases[1]
			
				for index, Alias in Command.Aliases {
					if (index == 1) continue;
				
					Aliases = `{Aliases}, {Alias}`
				}
			
				Context:Send(`Aliases: {tostring(Aliases)}`)
			}
			
			return;
		}
		
		for _, Command in CommandService.GetCommands() {
		
			if (Command.Level > CommandService.GetPlayerPermissionLevel(Context.Executor)) continue;
			
			if (Command.ArgInfo) {
				Context:Send(`{Command.Name} {Command.ArgInfo} - {Command.Description or "No description has been given."}`)
				continue;
			}
		
			Context:Send(`{Command.Name} - {Command.Description or "No description has been given."}`)
		}
		
		return 'For more details about a command use "help [command]"'
	}
})

CommandService.AddCommand({
	Name = "permissionlevel",
	Level = 0,
	Aliases = {"level", "mylevel", "permission"},
	Description = "Gives your current permission level.",
	
	Execute = function(Context, Args) {
		return `Permission Level: {CommandService.GetPlayerPermissionLevel(Context.Executor)}`
	}
})

CommandService.AddCommand({
	Name = "clear",
	Level = 0,
	Aliases = {"clean"},
	Description = "Wipes the history.",
	
	Execute = function(Context, Args) {
		CommandService.ClearHistory(Context.Executor)
	}
})

CommandService.AddCommand({
	Name = "setpermissionlevel",
	Level = 100,
	Aliases = {"setlevel"},
	ArgInfo = "<target> <level>",
	Description = "Sets someone's permission level",
	
	Execute = function(Context, Args) {
		var Target = CommandService.FindPlayerByShort(Args[1])
	
		CommandService.SetPlayerPermissionLevel(Target, tonumber(Args[2]))
		
		return `@{Target.Name}'s level has been changed to {Args[2]}`
	}
})
