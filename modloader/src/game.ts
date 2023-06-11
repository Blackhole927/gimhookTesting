declare var gimhook: any;

function setupGame() {
	// First of all, we need to setup the game-related stuff in the gimhook object.

	gimhook.game = {isGameActive: false, is2DGamemode: false};

	// Find the module that exports OnJoinedRoom to grab the room instance. (NOTE: THIS DOES NOT WORK ON NON-2D GAMEMODES, AS THEY USE BLUEBOAT INSTEAD OF COLYSEUS!)

	gimhook.addHook("require", (moduleObject) => {
		if (typeof moduleObject.exports !== "object") {
			return; // We only want objects for the exports value
		}

		if (!("OnJoinedRoom" in moduleObject.exports)) {
			return; // We only want the module that we are looking for
		}
		
		// If this is the module that we want, then intercept the OnJoinedRoom function and make it expose the instance as a global variable

		console.log(`Gimhook (game): Detected Colyseus instance in ${moduleObject.id}`);

		moduleObject.exports._OnJoinedRoom = moduleObject.exports.OnJoinedRoom;

		delete moduleObject.exports.OnJoinedRoom;

		moduleObject.exports.OnJoinedRoom = async (colyseusInstance) => {
			// Set the instance variable

			colyseusInstance.room.onMessage("*", (a, b) => {console.log(a, b)});

			gimhook.game.colyseusInstance = colyseusInstance;

			// Set is2DGamemode to true

			gimhook.game.is2DGamemode = true;

			// Set isGameActive to true

			gimhook.game.isGameActive = true;

			// Run the hooks that should run when the game is joined

			let hooks = gimhook.getHooks("join");
			
			for (let i = 0; i < hooks.length; i++) {
				hooks[i]();
			}

			// Run the original OnJoinedRoom function and return the response

			return await moduleObject.exports._OnJoinedRoom(gimhook.game.colyseusInstance);
		};

		return moduleObject;
	});
}

export default setupGame;