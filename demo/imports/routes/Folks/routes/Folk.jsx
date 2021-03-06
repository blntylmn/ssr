import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const Folk = ({ name }) => (
  <section>
    <h3>Selected</h3>
    <p><Link to="/folks">Back</Link></p>
    <p>Selected folk: {name}</p>
  </section>
);
Folk.propTypes = {
  name: PropTypes.string.isRequired,
};
export default Folk;
