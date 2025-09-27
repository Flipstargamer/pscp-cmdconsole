if (_G.CommandServiceLoaded) {
	require("CommandService")._Clean()
}

var InsertService = game:GetService("InsertService")
var UserInputService = game:GetService("UserInputService")

var CommandService = {}

var OpenGuiBind = Enum.KeyCode.Backquote

var CommandList = {}
var ViableCommands = {} // includes aliases

var CommandGui = InsertService:LoadAsset(117258958526567):WaitForChild("CmdConsole")
var CommandGuis = {}

var MessagePrefixes = {
	Command = "> ",
	Log = ":: ",
	Error = "!! "
}
var MessageColors = {
	Command = Color3.fromRGB(255, 211, 193),
	Log = Color3.fromRGB(255, 255, 255),
	Error = Color3.fromRGB(255, 0, 0),
}

var PermissionLevels = {}
var Permissions = {}

function MakeContext(Player, Command, CommandInput) {
	var Context = {}
	
	Context.Executor = Player
	Context.Command = Command
	Context.CommandInput = CommandInput
	
	function Context:Send(Text) {
		CommandService.SendMessage(Player, Text, "Log")
	}
	
	function Context:Error(Text) {
		CommandService.SendMessage(Player, Text, "Error")
	}
	
	return Context;
}

function CommandService.ExecuteCommand(Player, CommandInput, Args) {
	var Command = CommandList[ViableCommands[CommandInput]]
	
	if (!Command) {
		CommandService.SendMessage(Player, `Command {CommandInput} not found. Use "help" to get a list of commands.`, "Error")
		return;
	}
	
	if (Command.Level > CommandService.GetPlayerPermissionLevel(Player)) {
		CommandService.SendMessage(Player, `You do not have permissions for: {CommandInput}`, "Error")
		return;
	}
	
	var Result = Command.Execute(MakeContext(Player, Command, CommandInput), Args)
	
	if (Result) {
		CommandService.SendMessage(Player, Result, "Log")
	}
}

function CommandService.ParseMessage(Player, Message) {
	var Split = string.split(Message, " ")
	var Command = string.lower(Split[1])
	
	table.remove(Split, 1)
	
	CommandService.ExecuteCommand(Player, Command, Split)
}

function CommandService.SendMessage(Player, Message, Type) {
	var Gui = CommandGuis[Player]
	var Template = Gui.Background.History.Template:Clone()
	
	Template.Name = "Message"
	Template.Text = `{MessagePrefixes[Type]}{Message}`
	Template.TextColor3 = MessageColors[Type]
	Template.Visible = true
	Template.Parent = Gui.Background.History
}

function CommandService.AddCommand(CommandInfo) {
	CommandList[CommandInfo.Name] = CommandInfo
	
	ViableCommands[CommandInfo.Name] = CommandInfo.Name
	
	if (!CommandInfo.Aliases) return;
	
	for _, Alias in CommandInfo.Aliases {
		ViableCommands[Alias] = CommandInfo.Name
	}
}

function CommandService.CleanCommands() {
	CommandList = {}
	ViableCommands = {}
}

function CommandService.E_SetupGui(Player) {
	var Gui = CommandGui:Clone()
	var Command = Gui.Background.Command
	
	Gui.Enabled = false
	Gui.Parent = Player.PlayerGui
	
	var CleanUpConnection;
	CleanUpConnection = Player.Destroying:Connect(function() {
		Gui:Destroy()
		
		CommandGuis[Player] = nil
	})
	
	var InputConnection;
	InputConnection = Player:ConnectInstanceSignalAsync(UserInputService, "InputBegan", function(Input, Processed) {
		if (Processed) return;
		
		if (Input.Keycode != OpenGuiBind) return;
		
		Gui.Enabled = !Gui.Enabled
		
		if (Gui.Enabled) {
			Player:CallInstanceFunction(Command, "CaptureFocus", Command)
		} else {
			Player:CallInstanceFunction(Command, "ReleaseFocus", Command)
		}
	})
	
	var FocusLostConnection;
	FocusLostConnection = Player:ConnectInstanceSignalAsync(Command, "FocusLost", function(EnterPressed) {
		if (!EnterPressed) return;
		
		var Text = Player:GetInstancePropertyAsync(Command, "Text")
		if (Text == "") return;
		
		CommandService.SendMessage(Player, Text, "Command")
		CommandService.ParseMessage(Player, Text)
		
		Player:SetInstanceProperty(Command, "Text", "")
		Player:CallInstanceFunction(Command, "CaptureFocus", Command)
	})
	
	Gui.Destroying:Connect(function() {
		try { InputConnection:Disconnect() }
		try { FocusLostConnection:Disconnect() }
		try { CleanUpConnection:Disconnect() }
	})
	
	CommandGuis[Player] = Gui
	
	CommandService.SendMessage(Player, "Copyright Disclaimer: This command console is made by @Flipstargamer and licensed under the MIT License.", "Log")
}

function CommandService.GetCommands() {
	return CommandList;
}

function CommandService.GetCommand(Command) {
	return CommandList[Command];
}

function CommandService.AddPermissionLevel(Name, Level) {
	PermissionLevels[Name] = Level
}

function CommandService.RefreshLevel(Player) {
	Permissions[Player] = PermissionLevels[Player.Rank] or PermissionLevels[Player.Id]
	
	if (!Permissions[Player]) Permissions[Player] = 0
}

function CommandService.RefreshLevels() {
	for _, Player in GetPlayers() {
		CommandService.RefreshLevel(Player)
	}
}

function CommandService.CleanPermissionLevels() {
	PermissionLevels = {}
}

function CommandService.GetPlayerPermissionLevel(Player) {
	return Permissions[Player]
}

function CommandService.SetPlayerPermissionLevel(Player, Level) {
	Permissions[Player] = Level
}

function CommandService.ClearHistory(Player) {
	var Gui = CommandGuis[Player]
	
	for _, Message in Gui.Background.History:GetChildren() {
		if (!Message:IsA("TextLabel")) continue;
		if (Message.Name != "Message") continue;
		
		Message:Destroy()
	}
}

function CommandService.FindPlayerByShort(PlayerName) {
	for _, Player in GetPlayers() {
		if (string.lower(string.sub(Player.Name, 1, #PlayerName)) == string.lower(PlayerName)) {
			return Player;
		}
	}
}

function CommandService._Clean() {
	for _, Gui in CommandGuis {
		Gui:Destroy()
	}
	
	print("CommandService Cleaned")
}

for _, Player in GetPlayers() {
	CommandService.E_SetupGui(Player)
}

_G.CommandServiceLoaded = true
setonrequire("CommandService", CommandService)
