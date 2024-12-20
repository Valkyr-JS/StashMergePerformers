import MergeDropdownButton from "./components/MergeDropdownButton";
import MergeModal from "./components/MergeModal";
import SearchModal from "./components/SearchModal";
import { mergeButtonRootID } from "./constants";
import { fetchData, fetchPerformerData } from "./helpers";
import "./styles.scss";

const { PluginApi } = window;
const { React, ReactDOM } = PluginApi;
const { useIntl } = PluginApi.libraries.Intl;

// Wait for the performer details panel to load, as this contains the
PluginApi.patch.instead("PerformerDetailsPanel", function (props, _, Original) {
  // https://github.com/stashapp/stash/blob/develop/ui/v2.5/src/locales/en-GB.json
  const intl = useIntl();

  /* ----------------------------------------- Fetch data ----------------------------------------- */

  const [apiKey, setApiKey] = React.useState<ConfigGeneralResult["apiKey"]>("");
  const [needsAuth, setNeedsAuth] = React.useState(false);
  const [stashboxes, setStashboxes] = React.useState<StashBox[]>([]);
  const [thisPerformer, setThisPerformer] = React.useState<
    Performer | undefined
  >(undefined);

  const query = `query { configuration { general { apiKey password stashBoxes { endpoint name } } } }`;

  React.useEffect(() => {
    // Fetch Stashbox config data
    fetchData<{ data: { configuration: ConfigResult } }>(query).then((res) => {
      console.log(res);
      if (res?.data) {
        setApiKey(res.data.configuration.general.apiKey);
        setStashboxes(res.data.configuration.general.stashBoxes);

        // Set needsAuth to true if credentials have been set up for the Stash
        // instance.
        setNeedsAuth(res.data.configuration.general.password.length > 0);
      }
    });

    // Fetch data for the peformer whose page we're on.
    fetchPerformerData(props.performer.id).then((res) => setThisPerformer(res));
  }, []);

  /* ---------------------------------------- Search modal ---------------------------------------- */

  const [showSearchModal, setShowSearchModal] = React.useState(false);
  const [mergeDirection, setMergeDirection] =
    React.useState<MergeDirection>("from");
  const [selectedPerformer, setSelectedPerformer] = React.useState<
    Performer | undefined
  >();

  /** Handler for clicking the "Merge from..." button. */
  const handleMergeFromClick: React.MouseEventHandler<
    HTMLAnchorElement
  > = () => {
    setMergeDirection("from");
    setShowSearchModal(true);
  };

  /** Handler for clicking the "Merge into..." button. */
  const handleMergeIntoClick: React.MouseEventHandler<
    HTMLAnchorElement
  > = () => {
    setMergeDirection("into");
    setShowSearchModal(true);
  };

  /* ----------------------------------------- Merge modal ---------------------------------------- */

  const [showMergeModal, setShowMergeModal] = React.useState(false);

  const destinationPerformer =
    mergeDirection === "into" ? selectedPerformer : thisPerformer;

  const sourcePerformer =
    mergeDirection === "from" ? selectedPerformer : thisPerformer;

  /* ------------------------------------ Merge dropdown button ----------------------------------- */

  // Find .details-edit which contains the editing buttons under the performer
  // details.
  const elDetailsEdit = document.querySelector(".details-edit");
  const elDeleteButton = elDetailsEdit?.querySelector("button.delete");

  // Check if the merge button has already rendered to avoid re-rendering on
  // scroll.
  const mergeBtnExists =
    document.querySelector("#" + mergeButtonRootID) !== null;

  React.useEffect(() => {
    if (elDetailsEdit && !mergeBtnExists) {
      // Create the root for the buttons
      const elButtonRoot = document.createElement("div");
      elButtonRoot.setAttribute("id", mergeButtonRootID);

      // If the delete button has been found, set the button root before it.
      // Otherwise, add it to the end of the .details-edit container.
      elDeleteButton
        ? elDeleteButton.before(elButtonRoot)
        : elDetailsEdit.append(elButtonRoot);

      /**
       * Deprecated in React but still available via the Plugin API at time of
       * development.
       *
       * Disable the button if credentials have been enabled for the Stash
       * instance, but an API key hasn't been generated.
       */
      ReactDOM.render(
        <MergeDropdownButton
          disabled={needsAuth && !apiKey.length}
          intl={intl}
          mergeFromClickHandler={handleMergeFromClick}
          mergeIntoClickHandler={handleMergeIntoClick}
        />,
        elButtonRoot
      );

      if (needsAuth && !apiKey.length) {
        console.error(
          "It looks like you have credentials set up on your Stash instance, but have not generated an API key. Stash Mergers has been disabled to avoid errors. Go to 'Settings > Security > API Key > Generate API key' to enable Stash Mergers."
        );
      }
    }
  }, [apiKey, needsAuth]);

  /* ------------------------------------------ Component ----------------------------------------- */

  if (!thisPerformer) return [<Original {...props} />];

  return [
    <>
      <Original {...props} />
      <SearchModal
        mergeDirection={mergeDirection}
        selectedPerformer={selectedPerformer}
        setSelectedPerformer={setSelectedPerformer}
        setShow={setShowSearchModal}
        setShowMergeModal={setShowMergeModal}
        show={showSearchModal}
        thisPerformer={thisPerformer}
      />
      <MergeModal
        apiKey={apiKey}
        destinationPerformer={destinationPerformer}
        mergeDirection={mergeDirection}
        setShow={setShowMergeModal}
        show={showMergeModal}
        sourcePerformer={sourcePerformer}
        stashBoxes={stashboxes}
      />
    </>,
  ];
});
