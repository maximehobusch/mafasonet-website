class FourierTable {
	constructor(real,imag) {
//		alert(real + " -- " + imag);
		this.real = real;
		this.imag = imag;
	}
	calc(t) {
		let ret = 0;
		for (let i = 0; i < this.real.length; i++) {
			ret = ret + Math.cos(t*i)*this.real[i] + Math.sin(t*i)*this.imag[i];
		}
		return ret;
	}
}


class FourierGraph {
	constructor(xfour,yfour) {
		this.xfour = xfour;
		this.yfour = yfour;
//		alert(xfour.real + " -- " + xfour.imag + " | " + yfour.real + " -- " + yfour.imag);
	}
	pathOnCanvas(ctx,ox,oy,zx,zy,nt) {
		ctx.beginPath();
		ctx.moveTo(ox + this.xfour.calc(0)*zx,oy + this.yfour.calc(0)*zy);
		for (let i = 0; i < nt; i++) {
			let t = i/nt*Math.PI*2;
//			alert(t + " " + (this.xfour.calc(t)) + " " + (this.yfour.calc(t)));
			ctx.lineTo(ox + this.xfour.calc(t)*zx,oy + this.yfour.calc(t)*zy);
		}
		ctx.closePath();
	}
}

class FourierAnimation {
	constructor(xrfs,xifs,yrfs,yifs, rfour, gfour, bfour) {
		this.xrfs = xrfs;
		this.xifs = xifs;
		this.yrfs = yrfs;
		this.yifs = yifs;
		
		this.rfour = rfour;
		this.gfour = gfour;
		this.bfour = bfour;
	}
	drawOnCanvas(ctx,ox,oy,zx,zy,nt, nd, alpha ,pathfillingfunction) {
		for (let i = 0; i < nd; i++) {
			let d = i/nd*Math.PI*2;
			let fg = new FourierGraph(new FourierTable(this.calcFs(this.xrfs,d),this.calcFs(this.xifs,d)),new FourierTable(this.calcFs(this.yrfs,d),this.calcFs(this.yifs,d)));
			fg.pathOnCanvas(ctx,ox,oy,zx,zy,nt);
			ctx.strokeStyle = "rgba(" + this.cutcolor(this.rfour.calc(d)) + "," + this.cutcolor(this.gfour.calc(d)) + "," + this.cutcolor(this.bfour.calc(d)) + "," + alpha + ")";
			pathfillingfunction(ctx,d,ox,oy,zx,zy);
		}
	}
	drawPartOnCanvas(ctx,ox,oy,zx,zy,nt, nd, alpha ,pathfillingfunction, doffs, n) {
		for (let i = 0; i < n; i++) {
			let d = (i+doffs)/nd*Math.PI*2;
			let fg = new FourierGraph(new FourierTable(this.calcFs(this.xrfs,d),this.calcFs(this.xifs,d)),new FourierTable(this.calcFs(this.yrfs,d),this.calcFs(this.yifs,d)));
			fg.pathOnCanvas(ctx,ox,oy,zx,zy,nt);
			ctx.strokeStyle = "rgba(" + this.cutcolor(this.rfour.calc(d)) + "," + this.cutcolor(this.gfour.calc(d)) + "," + this.cutcolor(this.bfour.calc(d)) + "," + alpha + ")";
			pathfillingfunction(ctx,d,ox,oy,zx,zy);
		}
	}
	drawOneOnCanvas(ctx,ox,oy,zx,zy,nt, nd, alpha ,pathfillingfunction, d) {
		let fg = new FourierGraph(new FourierTable(this.calcFs(this.xrfs,d),this.calcFs(this.xifs,d)),new FourierTable(this.calcFs(this.yrfs,d),this.calcFs(this.yifs,d)));
		fg.pathOnCanvas(ctx,ox,oy,zx,zy,nt);
		ctx.strokeStyle = "rgba(" + this.cutcolor(this.rfour.calc(d)) + "," + this.cutcolor(this.gfour.calc(d)) + "," + this.cutcolor(this.bfour.calc(d)) + "," + alpha + ")";
		pathfillingfunction(ctx,d,ox,oy,zx,zy);
	}
	cutcolor(v) {
		return Math.floor((-Math.abs(Math.tanh(v))+1)*255);
	}
	calcFs(fs,d) {
//		alert(fs + " " + d);
		let ret = [];
		for (let i = 0; i < fs.length; i++) {
			ret.push(fs[i].calc(d));
		}
		return ret;
	}
}
