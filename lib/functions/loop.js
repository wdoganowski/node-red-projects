// name: loop
// outputs: 2
// Loop function
// Top output provides triger for next actions
// Botton output should be connected to the input through a dealy
// The msg.payload can consis one of actions: start, stop, toggle
// Other content is ignored
// On the outoput the msg.payload contains current loop state

context.loop = context.loop || "stop";
context.loops = context.loops || 0;

//console.log("topic :" + msg.topic);
//console.log("loop  :" + context.loop);
//console.log("loops :" + context.loops);
//console.log("action:" + msg.payload);

switch (msg.payload) {
	case "stop":
		context.loops = context.loops + 1;
		msg.payload = "stopped";
		context.loop = "stop";
		return [msg,null];
	case "toggle":
		if (context.loop == "start") {
			msg.payload = "stopped";
			context.loop = "stop";
			return [msg,null];
		} else {
			msg.payload = "started";
			context.loop = "loop";
			context.loops = 1;
			return [msg,msg];
		}
	case "start":
		msg.payload = "started";
		context.loop = "loop";
		context.loops = 1;
		return [msg,msg];
	default:
		if (context.loop == "loop") {
			context.loops = context.loops + 1;
			msg.payload = "loop:" + context.loops;
			return [msg,msg];
		} else {
			return [null,null]; 
		}
}