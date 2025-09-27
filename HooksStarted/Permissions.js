var CommandService = require("CommandService")

CommandService.CleanPermissionLevels()

CommandService.AddPermissionLevel(OWNER_ID, 100)
CommandService.AddPermissionLevel("Coowner", 40)
CommandService.AddPermissionLevel("Admin", 30)
CommandService.AddPermissionLevel("Mod", 20)
CommandService.AddPermissionLevel("Helper", 10)

CommandService.RefreshLevels()
