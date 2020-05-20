import React, { Component } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import './rewards_categories.scss';

class RewardsCategories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currItem: null,
      copiedItem: null
    }
  }

  handleDragStart = (e, item) => {
    this.setState({ currItem: item })
  }
  handleDrop = (e) => {
    e.preventDefault();
    e.target.appendChile(<span>www</span>)
  }
  handleDragOver = (e) => {
    e.preventDefault();
    let currItem = this.state.currItem;
    this.setState({ copiedItem: currItem });
    // this.setState({currItem: null});
  }

  render = () => {

    return (
      <div className='grid'>
        <div className='col-2'>
          <div className='tbl-col'>
            <div>Rewards</div>
            <div className='cell'>
              <div draggable="true" onDragStart={(e) => this.handleDragStart(e, 'r1')}>R1</div>
            </div>
            <div className='cell'>
              <div draggable="true" onDragStart={(e) => this.handleDragStart(e, 'r2')}>R2</div>
            </div>
            <div className='cell'>
              <div draggable="true" onDragStart={(e) => this.handleDragStart(e, 'r3')}>R3</div>
            </div>
            <div className='cell'>
              <div draggable="true" onDragStart={(e) => this.handleDragStart(e, 'r4')}>R4</div>
            </div>
            <div className='cell'>
              <div draggable="true" onDragStart={(e) => this.handleDragStart(e, 'r5')}>R5</div>
            </div>
          </div>
        </div>
        <div className='col-2'>
          <div className='tbl-col'>
            <div>C1</div>
            <div className='cell'
              onDrop={(e) => this.handleDrop(e)}
              onDragOver={(e => this.handleDragOver(e))}
            >
              <div draggable="true" onDragStart={(e) => this.handleDragStart(e, 'ww')}>
                {this.state.copiedItem}
              </div>
            </div>
            <div className='cell'
              onDrop={(e) => this.handleDrop(e)}
              onDragOver={(e => this.handleDragOver(e))}>
              <div draggable="true" onDragStart={(e) => this.handleDragStart(e, 'xx')}>
                {this.state.copiedItem}
              </div>
          
              </div>
            <div className='cell'
              onDrop={(e) => this.handleDrop(e)}
              onDragOver={(e => this.handleDragOver(e))}>{this.state.copiedItem}</div>
            <div className='cell'
              onDrop={(e) => this.handleDrop(e)}
              onDragOver={(e => this.handleDragOver(e))}>{this.state.copiedItem}</div>
            <div className='cell'
              onDrop={(e) => this.handleDrop(e)}
              onDragOver={(e => this.handleDragOver(e))}>{this.state.copiedItem}</div>
          </div>
        </div>
        <div className='col-2'>
          <div className='tbl-col'>
            <div>C2</div>
            <div className='cell'
              onDrop={(e) => this.handleDrop(e)}
              onDragOver={(e => this.handleDragOver(e))}>{this.state.copiedItem}</div>
            <div className='cell'
              onDrop={(e) => this.handleDrop(e)}
              onDragOver={(e => this.handleDragOver(e))}>{this.state.copiedItem}</div>
            <div className='cell'
              onDrop={(e) => this.handleDrop(e)}
              onDragOver={(e => this.handleDragOver(e))}>{this.state.copiedItem}</div>
            <div className='cell'
              onDrop={(e) => this.handleDrop(e)}
              onDragOver={(e => this.handleDragOver(e))}>{this.state.copiedItem}</div>
            <div className='cell'
              onDrop={(e) => this.handleDrop(e)}
              onDragOver={(e => this.handleDragOver(e))}>{this.state.copiedItem}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default RewardsCategories;