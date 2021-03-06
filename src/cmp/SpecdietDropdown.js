import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { updateSpecdietCurrent } from '../rdc/reducer'

class SpecdietDropdown extends Component {
  //handleAddition = (e, { value }) => {}

  handleChange = (e, { value }) => {
    this.props.updateSpecdietCurrent(value)
  }

  render() {
    //console.log('current values at render: ', this.props.specdietOptionsCurrent)
    return (
      <Dropdown
        options={this.props.specdietoptions}
        placeholder="Erityisruokavalio"
        search
        selection
        fluid
        multiple
        allowAdditions
        value={this.props.specdietOptionsCurrent}
        //onAddItem={this.handleAddition}
        onChange={this.handleChange}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    specdietoptions: state.specdietOptions,
    specdietOptionsCurrent: state.specdietOptionsCurrent
  }
}

export default connect(mapStateToProps, { updateSpecdietCurrent })(
  SpecdietDropdown
)
