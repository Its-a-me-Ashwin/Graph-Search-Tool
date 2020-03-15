import React, { Component } from 'react';

class Canvas extends Component {
    state = {  }

    componentDidMount() {
        const canvas = this.refs.canvas
        const ctx = canvas.getContext("2d")
        const img = this.refs.image    
        img.onload = () => {
          ctx.drawImage(img, 0, 0)
          ctx.font = "40px Courier"
          ctx.fillText(this.props.text, 210, 75)
        }
    }PES1201700003

    render() { 
        return ( <div>
            <h2> Visualized </h2>
            <canvas ref="canvas" width={500} height={500} />    
        </div> );
    }
}
 
export default Canvas;