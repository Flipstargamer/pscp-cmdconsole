var _ = Plr:GetAttribute("TrueLoaded") or Plr:GetAttributeChangedSignal("TrueLoaded"):Wait()

var CommandService = require("CommandService")

CommandService.E_SetupGui(Plr)
CommandService.RefreshLevel(Plr)
