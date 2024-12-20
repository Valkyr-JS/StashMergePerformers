import { default as cx } from "classnames";
import { IntlShape } from "react-intl";

const { PluginApi } = window;
const { React } = PluginApi;
const { Icon } = PluginApi.components;
const { DropdownButton } = PluginApi.libraries.Bootstrap;
const { faRightToBracket, faRightFromBracket } =
  PluginApi.libraries.FontAwesomeSolid;

const MergeDropdownButton: React.FC<MergeDropdownButtonProps> = ({
  intl,
  ...props
}) => {
  const merge = intl.formatMessage({ id: "actions.merge" });
  return (
    <DropdownButton
      disabled={props.disabled}
      id="merge-performer-dropdown-button"
      title={merge + "..."}
      variant="secondary"
    >
      <DropdownMenuItem onClick={props.mergeFromClickHandler}>
        <Icon icon={faRightToBracket} />
        {intl.formatMessage({ id: "actions.merge_from" })}...
      </DropdownMenuItem>
      <DropdownMenuItem onClick={props.mergeIntoClickHandler}>
        <Icon icon={faRightFromBracket} />
        {intl.formatMessage({ id: "actions.merge_into" })}...
      </DropdownMenuItem>
    </DropdownButton>
  );
};

export default MergeDropdownButton;

interface MergeDropdownButtonProps {
  /** Whether the button is disabled. */
  disabled: boolean;

  /** Component can't access intl for some reason, so it needs to be passed.
   * */
  intl: IntlShape;

  /** The click handler for the "Merge from..." button. */
  mergeFromClickHandler: React.MouseEventHandler<HTMLAnchorElement>;

  /** The click handler for the "Merge into..." button. */
  mergeIntoClickHandler: React.MouseEventHandler<HTMLAnchorElement>;
}

/* ---------------------------------------------------------------------------------------------- */
/*                                  Dropdown menu item component                                  */
/* ---------------------------------------------------------------------------------------------- */

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  onClick,
  ...props
}) => {
  const classes = cx("bg-secondary", "text-white", "dropdown-item");
  return (
    <a
      href="#"
      className={classes}
      role="button"
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      {...props}
    />
  );
};

interface DropdownMenuItemProps
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  /** The required click event for the menu item. */
  onClick: React.MouseEventHandler<HTMLAnchorElement>;
}
