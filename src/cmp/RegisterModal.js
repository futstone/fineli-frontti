import React, { Component } from 'react'
import {
  Button,
  Icon,
  Modal,
  Input,
  Segment,
  Rail,
  Checkbox
} from 'semantic-ui-react'
import { connect } from 'react-redux'
import {
  toggleRegisterModal,
  registerUser,
  login,
  setSuggestedAmounts,
  setUserMeals
} from '../rdc/reducer'
import dataservice from '../srv/dataservice'

class RegisterModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      radio: 'male',
      visible: false,
      errorMsg: ''
    }
  }

  onChangeHandler = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  onRadioChange = (e, { value }) => this.setState({ radio: value })

  toggleErrorVisibility = errorMsg => {
    this.setState({ visible: !this.state.visible, errorMsg: errorMsg }, () => {
      setTimeout(() => {
        this.setState({ visible: !this.state.visible, errorMsg: '' })
      }, 3000)
    })
  }

  submit = async () => {
    const user = await dataservice.registerUser({
      email: this.state.email,
      password: this.state.password,
      gender: this.state.radio
    })
    if (!user.error) {
      window.localStorage.setItem(
        'user',
        JSON.stringify({ token: user.data.token, email: user.data.email })
      )
      this.props.login()
      const userdata = await dataservice.loadUserdata(user.data.token)
      if (!userdata.error) {
        this.props.setSuggestedAmounts(userdata.data[0])
        this.props.setUserMeals(userdata.data[1])
        this.props.toggleRegisterModal()
      } else {
        this.toggleErrorVisibility(userdata.error)
      }
    } else {
      this.toggleErrorVisibility(user.error)
    }
  }

  render() {
    const hideWhenVisible = { display: this.state.visible ? '' : 'none' }
    return (
      <Modal
        size={'small'}
        open={this.props.open}
        onClose={this.props.toggleRegisterModal}
        dimmer={'blurring'}
      >
        <Rail internal attached position="right" size="massive">
          <Segment inverted color="red" tertiary style={hideWhenVisible}>
            <h4>{this.state.errorMsg}</h4>
          </Segment>
        </Rail>
        <Modal.Header>Uusi käyttäjätunnus</Modal.Header>
        <Modal.Content>
          <h3>Sähköposti:</h3>
          <Input
            fluid={true}
            iconPosition="left"
            placeholder="Sähköposti"
            size="large"
            name="email"
            onChange={this.onChangeHandler}
          >
            <Icon name="at" />
            <input />
          </Input>
          <h3>Salasana: 6 - 60 merkkiä</h3>
          <Input
            fluid={true}
            placeholder="Salasana"
            type="password"
            size="large"
            name="password"
            onChange={this.onChangeHandler}
          />
          <Checkbox
            radio
            label="Mies"
            value="male"
            checked={this.state.radio === 'male'}
            onChange={this.onRadioChange}
          />
          <Checkbox
            radio
            label="Nainen"
            value="female"
            checked={this.state.radio === 'female'}
            onChange={this.onRadioChange}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={this.props.toggleRegisterModal}>
            Sulje
          </Button>
          <Button
            positive
            onClick={this.submit}
            icon="checkmark"
            labelPosition="right"
            content="Lähetä"
          />
        </Modal.Actions>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  return {
    open: state.registerModalOpen
  }
}

export default connect(
  mapStateToProps,
  {
    toggleRegisterModal,
    registerUser,
    login,
    setSuggestedAmounts,
    setUserMeals
  }
)(RegisterModal)
