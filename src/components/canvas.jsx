import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
    }
    render() { 
        return (<div>
            <p>Please choose a repository from the list below.</p>
            <ul>
                <li><Link to="/react">React</Link></li>
            </ul>
        </div>  );
    }
}
 
export default Canvas;