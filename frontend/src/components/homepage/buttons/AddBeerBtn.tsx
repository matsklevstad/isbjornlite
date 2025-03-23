import React, { useState } from "react";
import {
  Modal,
  Button,
  Stack,
  SegmentedControl,
  Checkbox,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

const AddBeerBtn = () => {
  const [opened, setOpened] = useState(false);
  const [volume, setVolume] = useState(""); // Selected volume from segmented control
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confirmed) {
      alert(
        "Du må bekrefte at du på ærlig og redlig vis har drukket opp en isbjørn lite!"
      );
      return;
    }
    if (!volume) {
      alert("Vennligst velg en volumstørrelse.");
      return;
    }

    // Create a new beer object using default values for missing fields
    const newBeer = {
      name: "Standard Beer", // Default beer name
      type: "Standard Type", // Default beer type
      brewery: "Standard Brewery", // Default brewery name
      volume, // Volume from segmented control
    };

    // TODO: Add your API call to post the beer here
    console.log("New Beer:", newBeer);

    // Close modal and reset fields
    setOpened(false);
    setVolume("");
    setConfirmed(false);
  };

  return (
    <>
      <button
        onClick={() => setOpened(true)}
        className="absolute right-10 bottom-10 z-10 opacity-90">
        <IconPlus size={35} color="#ffffff" />
      </button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Register en ny isbjørn">
        <form onSubmit={handleSubmit}>
          <Stack>
            <SegmentedControl
              label="Velg volum"
              color="blue"
              data={[
                { label: "0.33 L", value: "0.33" },
                { label: "0.50 L", value: "0.50" },
              ]}
              value={volume}
              onChange={(value) => setVolume(value)}
            />
            <Checkbox
              label="Jeg bekrefter at jeg på ærlig og redlig vis har drukket opp en isbjørn lite."
              fs="italic"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.currentTarget.checked)}
            />
            <Button type="submit" disabled={!confirmed || !volume}>
              Legg til
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default AddBeerBtn;
