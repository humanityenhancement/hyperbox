Engine.Import("*");
Engine.Import("UI");
App.Manifest({
	version: "1.0",
	name: "HelloWorld",
	author: "Hyperbox Technologies",
	description: null,
	icon: null
});
App.Config.DEBUG = true;
App.Script("Plugin/Application.js", function() {
	var builder = function(a, b, c) { var d = []; for(var i = 0; i < a.length; i++) { d.push(b + "/" + a[i] + "." + c); } return d; };
	var activities = builder(["Main"], "App", "js"), progress = 0;
	activities.Loop(function(a, b) {
		App.Script(b, function() {
			progress++;
			if(progress == activities.length) {
				Application.Open(Main);
			}
		});
	});
});
Atom("*").M(0).P(0).B(0).Done();
Atom("HTML, BODY").C("#FFF").BG("#444").FF("calibri").FS("14px").Done();
Document.Set("body").Attr("onselectstart", "return false"); Document.Set("body").Attr("ondragstart", "return false");