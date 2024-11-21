import { default as cx } from "classnames";
const { PluginApi } = window;
const { React } = PluginApi;

const FormInputGroup: React.FC<FormInputGroupProps> = (props) => {
  const classes = cx("input-group", props.className);
  return (
    <div className="col-6">
      <div className={classes} style={props.style}>
        {props.children}
      </div>
    </div>
  );
};

export default FormInputGroup;

interface FormInputGroupProps extends React.PropsWithChildren {
  className?: string;
  style?: React.CSSProperties;
}
