import React, { Component } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

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
      history: [],
      currHistoryTrackNo: 0
    }
    const csrfToken = document.querySelector('[name=csrf-token]').content;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
  }

  updateCategories = (matrixId, reward, type) => {
    const { categories, rewards, matrix } = this.state;
    const catMatrixId = Object.values(matrix).filter(m => m.id === matrixId)[0].category.id;
    const newCategories = [...categories];
    let editedCategory = editedCategory = newCategories.filter(nc => nc.id === catMatrixId)[0];
    if (type === 'add') {
      editedCategory.rewards.push(reward);
    } else {
      editedCategory.rewards = editedCategory.rewards.filter(r => r.id !== reward.id);
    }
    this.setState({ categories: newCategories });
  }
  updateHistory = () => {
    const { history } = this.state;
    let historyRecord = JSON.parse(JSON.stringify(this.state.matrix));
    this.setState({ history: [...history, historyRecord] });
    this.setState({ currHistoryTrackNo: history.length - 1 });
  }
  async componentDidMount() {
    await axios.get('/v1/categories.json')
      .then(response => {
        this.setState({ categories: response.data });
      })
      .catch(error => console.log(error));

    await axios.get('/v1/rewards.json')
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
    this.updateHistory()

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
    console.log(matrixId);
    const { categories, rewards, matrix, draggingReward } = this.state;
    if (draggingReward) {
      let updatedMatrixItem = matrix[matrixId];
      updatedMatrixItem.reward = draggingReward;
      updatedMatrixItem.title = draggingReward.name;
      let newMatrix = Object.assign({}, matrix);
      newMatrix[matrixId] = updatedMatrixItem;
      this.setState({ matrix: newMatrix });
      this.setState({ draggingReward: null });
      this.updateCategories(matrixId, draggingReward, 'add');
      this.updateHistory();
    }
  }

  onDragStart = (e, currReward, removeMatrixId) => {
    console.log(currReward)

    this.setState({ draggingReward: currReward });
    if (removeMatrixId) {
      this.removeReward(removeMatrixId);
    }
  }

  removeReward = matrixId => {
    const { categories, rewards, matrix } = this.state;
    let updatedMatrixItem = matrix[matrixId];
    let oldReward = updatedMatrixItem.reward;
    updatedMatrixItem.reward = null;
    updatedMatrixItem.title = '-';
    let newMatrix = Object.assign({}, matrix);
    newMatrix[matrixId] = updatedMatrixItem;
    this.setState({ matrix: newMatrix });
    this.updateCategories(matrixId, oldReward, 'remove');
    this.updateHistory();
  }


  renderContent = () => {
    const { categories, rewards, matrix, draggingReward } = this.state;
    return rewards.map((reward, i) => <div className='tbl-cat__row' key={uuidv4()}>
      {
        categories.map((cat, j) => {
          let currReward = rewards[i];
          let currCat = categories[j];
          let matrixId = `${currReward.name}${currCat.name}`;
          let hasReward = this.hasReward(matrixId);
          let contentStyle = draggingReward ? 'tbl-cat__cell-content droppable' : 'tbl-cat__cell-content';
          let tblCatCellStyle = draggingReward ? 'tbl-cat__cell draggable' : 'tbl-cat__cell';
          return (
            <div className={tblCatCellStyle} key={uuidv4()}
              onDragOver={(e) => { e.preventDefault(); }}
              onDrop={(e) => this.onDrop(e, matrixId)}
              onMouseUp={(e) => { this.onDrop(e, matrixId) }}
            >
              <div className={contentStyle}
                draggable='true'
                onDragStart={(e) => this.onDragStart(e, currReward, matrixId)}
              >
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

  saveToDB = () => {
    console.log(Object.values(this.state.matrix));
    axios.patch('/v1/categories/update_bulk.json', { categories: Object.values(this.state.categories) })
      .then(response => {
        console.log(response);
      })
      .catch(error => console.log(error));
  }

  setMatrixFromHistory = (idx) => {
    const { history } = this.state;
    if (history[idx]) {
      let newMatrix = JSON.parse(JSON.stringify(history[idx]));
      this.setState({ matrix: newMatrix });
    }
  }
  undo = e => {
    const { history, currHistoryTrackNo } = this.state;
    if (currHistoryTrackNo < 0) return;
    this.setState(prevState => {
      return { currHistoryTrackNo: prevState.currHistoryTrackNo - 1 }
    }, this.setMatrixFromHistory(currHistoryTrackNo));

  }


  redo = e => {
    const { history, currHistoryTrackNo } = this.state;
    if (currHistoryTrackNo >= history.length) return;
    this.setState(prevState => {
      return { currHistoryTrackNo: prevState.currHistoryTrackNo + 1 }
    }, this.setMatrixFromHistory(currHistoryTrackNo));
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
        <div className='btn-group'>
          <button onClick={() => this.saveToDB()}>Save to DB</button>
          <button onClick={(e) => this.undo()}>Undo</button>
          <button onClick={(e) => this.redo()}>Redo</button>
        </div>
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