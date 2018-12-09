import React from 'react'

class Register extends React.Component {
  // state = { redirectToReferrer: false };

  // login = () => {
  //   fakeAuth.authenticate(() => {
  //     this.setState({ redirectToReferrer: true });
  //   });
  // };

  render() {
    // let { from } = this.props.location.state || { from: { pathname: "/" } };
    // let { redirectToReferrer } = this.state;

    // if (redirectToReferrer) return <Redirect to={from} />;

    return (
      <div>
        register
        {/* <p>You must log in to view the page at {from.pathname}</p>
        <button onClick={this.login}>Log in</button> */}
      </div>
    );
  }
}

export default Register