import MergeDropdownButton from "./components/MergeDropdownButton";
import SearchModal from "./components/SearchModal";
import { mergeButtonRootID } from "./constants";
import "./styles.scss";

const { PluginApi } = window;
const { React, ReactDOM } = PluginApi;

// Replace the performer details panel at the top of the performer page with one
// that has yellow text and an additional component.
PluginApi.patch.instead("PerformerDetailsPanel", function (props, _, Original) {
  // Find .details-edit which contains the editing buttons under the performer
  // details.
  const elDetailsEdit = document.querySelector(".details-edit");
  const elDeleteButton = elDetailsEdit?.querySelector("button.delete");

  // Check if the merge button has already rendered to avoid re-rendering on
  // scroll.
  const mergeBtnExists =
    document.querySelector("#" + mergeButtonRootID) !== null;

  if (elDetailsEdit && !mergeBtnExists) {
    // Create the root for the buttons
    const elButtonRoot = document.createElement("div");
    elButtonRoot.setAttribute("id", mergeButtonRootID);

    // If the delete button has been found, set the button root before it.
    // Otherwise, add it to the end of the .details-edit container.
    elDeleteButton
      ? elDeleteButton.before(elButtonRoot)
      : elDetailsEdit.append(elButtonRoot);

    // Deprecated in React but still available via the Plugin API at time of
    // development.
    ReactDOM.render(<MergeDropdownButton />, elButtonRoot);
  }

  /* -------------------------------------------- Modal ------------------------------------------- */

  const [showModal, setShowModal] = React.useState(false);

  // Return the component
  return [
    <>
      <Original {...props} />
      <SearchModal show={showModal} setShow={setShowModal} />
    </>,
  ];
});
