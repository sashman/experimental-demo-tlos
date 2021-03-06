var Npc = function(x,y,still,dialogue,questid,talking,silence){
	return({
		questid:questid,
		group:"walls",
		tileset:"npc",
		zindex:0, // Needed for zindexed objects
		x:x,
		y:y,
		myDialogue:dialogue,
		iamTalking:false,
		silence:silence,
		shadow:{tileset:"shadows",tile:0},
		frames:{
			still:{ speed:6, frames:still },
			talking:{ speed:6, frames:(talking==null?still:talking) }
		},

		doPlayerAction:function(sw) {
			if (this.silence) AkihabaraAudio.fadeOut(this,"background",null,{channel:"bgmusic"});
			this.iamTalking=true; // go in talking mode
			maingame.startDialogue(this.myDialogue); // Starts its dialogue. Is another object because of z-index
		},

		initialize:function() {
			AkihabaraTopview.initialize(this); // Any particular initialization. Just the auto z-index
		},

		first:function(by) {
			this.counter=(this.counter+1)%12;

			if (this.iamTalking) {
				this.frame=AkihabaraGamebox.decideFrame(this.counter,this.frames.talking);
				if (!AkihabaraGamebox.getObject("foreground","dialogue")) {// Check if the dialogue ended
					this.iamTalking=false; // Stop talking
					if ((this.questid!=null)&&(!tilemaps.queststatus[this.questid])) {
						tilemaps.queststatus[this.questid]=true; // If related to a quest, the quest is marked as done
						maingame.addQuestClear();
					}
				}
			} else
				this.frame=AkihabaraGamebox.decideFrame(this.counter,this.frames.still);
		},

		blit:function() {
			if (AkihabaraGamebox.objectIsVisible(this)) {
				// Shadowed object. First draws the shadow...
				AkihabaraGamebox.blitTile(AkihabaraGamebox.getBufferContext(),{tileset:this.shadow.tileset,tile:this.shadow.tile,dx:this.x,dy:this.y+this.h-AkihabaraGamebox.getTiles(this.shadow.tileset).tileh+4,camera:this.camera});
				// Then the object. Notes that the y is y-z to have the "over the floor" effect.
				AkihabaraGamebox.blitTile(AkihabaraGamebox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x,dy:this.y+this.z,camera:this.camera,fliph:this.fliph,flipv:this.flipv});
			 }
		 }
	});
}
