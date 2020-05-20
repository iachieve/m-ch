import React, { Component } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import './rewards_categories.scss';

class catTemplate {
  constructor(id, category = null, reward = null) {
    this.id = id;
    this.reward = reward;
    this.category = category;
    this.title = reward ? this.reward.name : '-';
  }
}

class RewardsCategories extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rewards: [],
      categories: [],
      matrix: {},
      draggingReward: null,


    }
  }

  async componentDidMount() {
    await axios.get('http://localhost:3000/v1/categories.json')
      .then(response => {
        this.setState({ categories: response.data });
      })
      .catch(error => console.log(error));

    await axios.get('http://localhost:3000/v1/rewards.json')
      .then(response => {
        this.setState({ rewards: response.data });
      })
      .catch(error => console.log(error));

    const { categories, rewards, matrix } = this.state;
    let newMatrix = {};
    for (let i = 0; i < rewards.length; i++) {
      const reward = rewards[i];
      for (let j = 0; j < categories.length; j++) {
        const cat = categories[j];
        let id = `${reward.name}${cat.name}`;
        let newReward = new catTemplate(id, cat, null);
        if (cat.rewards.length) {
          let rewardExist = Object.values(cat.rewards).filter(r => r.name === reward.name);
          if (rewardExist.length) {
            newReward.reward = rewardExist[0]
            newReward.title = rewardExist[0].name;
          }
        }
        newMatrix[id] = newReward;
      }
    }
    this.setState({ matrix: newMatrix });
  }

  hasReward = matrixId => {
    const { categories, rewards, matrix, draggingReward } = this.state;
    let updatedMatrixItem = matrix[matrixId];
    if (updatedMatrixItem && updatedMatrixItem.reward) {
      return true;
    } else {
      return false;
    }
  }

  onDrop = (e, matrixId) => {
    e.preventDefault();
    const { categories, rewards, matrix, draggingReward } = this.state;
    let updatedMatrixItem = matrix[matrixId];
    updatedMatrixItem.reward = draggingReward;
    updatedMatrixItem.title = draggingReward.name;
    let newMatrix = Object.assign({}, matrix);
    newMatrix[matrixId] = updatedMatrixItem;
    this.setState({ matrix: newMatrix });
    this.setState({ draggingReward: null });
  }

  onDragStart = (e, currReward) => {
    this.setState({ draggingReward: currReward })
  }

  removeReward = matrixId => {
    const { categories, rewards, matrix } = this.state;
    let updatedMatrixItem = matrix[matrixId];
    updatedMatrixItem.reward = null;
    updatedMatrixItem.title = '-';
    let newMatrix = Object.assign({}, matrix);
    newMatrix[matrixId] = updatedMatrixItem;
    this.setState({ matrix: newMatrix });
  }

  renderContent = () => {
    const { categories, rewards, matrix, draggingReward } = this.state;
    let i = 0;

    return rewards.map((reward, i) => <div className='tbl-cat__row' key={uuidv4()}>
      {
        categories.map((cat, j) => {
          let currReward = rewards[i];
          let currCat = categories[j];
          let matrixId = `${currReward.name}${currCat.name}`;
          let hasReward = this.hasReward(matrixId);
          let contentStyle = draggingReward ? 'tbl-cat__cell-content droppable' : 'tbl-cat__cell-content';
          return (
            <div className='tbl-cat__cell' key={uuidv4()}>
              <div className={contentStyle}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => this.onDrop(e, matrixId)} >
                {matrix[matrixId].title}
                {
                  hasReward ?
                    (<button onClick={() => this.removeReward(matrixId)}>X</button>)
                    : null
                }
              </div>
            </div>
          )
        })
      }
    </div>);
  }

  render = () => {
    const { categories, rewards, matrix, draggingReward } = this.state;
    let len = categories.length * rewards.length
    if (!categories || !rewards || Object.values(matrix).length !== len) {
      return <div>loading ... </div>
    }
    let rewardStyle = draggingReward ? 'tbl-rewards__cell draggable' : 'tbl-rewards__cell';

    return (
      <div className='container'>
        <h3>Rewards Categories</h3>

        <div className='outer-grid'>
          <div className='tbl-rewards'>
            <div className='tbl-rewards__header'>Rewards</div>
            <div>
              {
                rewards.map(r => (
                  <div className={rewardStyle}
                    draggable='true' key={r.id}
                    onDragStart={(e) => this.onDragStart(e, r)}
                  >{r.name}</div>))
              }
            </div>
          </div>
          <div className='tbl-cat'>
            <div className='tbl-cat__header'>Categories</div>
            <div className='tbl-cat__sub-header'>
              {
                categories.map(c => <div key={c.id}>{c.name}</div>)
              }
            </div>
            <div>
              {
                this.renderContent()
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RewardsCategories;