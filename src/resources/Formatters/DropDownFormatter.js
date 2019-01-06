// Used for displaying the value of a dropdown (using DropDownEditor) when not editing it.
// Accepts the same parameters as the DropDownEditor.
import PropTypes from 'prop-types';

const React = require('react');

class DropDownFormatter extends React.Component {
    static propTypes = {
        options: PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.shape({
                    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                    title: PropTypes.string,
                    value: PropTypes.string,
                    text: PropTypes.string
                })
            ])).isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    };

    shouldComponentUpdate(nextProps: any): boolean {
        return nextProps.value !== this.props.value;
    }

    render(): ?ReactElement {
        let value = this.props.value;
        let option = this.props.options.filter(function (v) {
            return v == value || v.value == value || v.id == value;
        })[0];
        if (!option) {
            option = value;
        }
        let title = option.title || option.value || option;
        let text = option.text || option.value || option;
        return <div title={title}>{text}</div>;
    }
}

export default DropDownFormatter;
