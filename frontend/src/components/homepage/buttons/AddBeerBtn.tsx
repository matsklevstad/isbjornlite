import React, { useState } from "react";
import {
  Modal,
  Button,
  Stack,
  SegmentedControl,
  Checkbox,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { beerService } from "@/services/beerService";
import { Beer } from "@/models/beer";
import { useAuthStore } from "@/stores/authStore";

const AddBeerBtn = () => {
  const [opened, setOpened] = useState(false);
  const [volume, setVolume] = useState(""); // Selected volume from segmented control
  const [confirmed, setConfirmed] = useState(false);
  const { user } = useAuthStore();

  const queryClient = useQueryClient();

  // Create a mutation that uses your createBeer API function
  const mutation = useMutation<Beer, Error, Beer>({
    mutationFn: beerService.createBeer,
    onSuccess: () => {
      alert("Isbjørn er lagt til!");
      queryClient.invalidateQueries({ queryKey: ["beers"] });
    },

    onError: (error: Error) => {
      console.error("Error adding beer:", error);
      alert("Det oppstod en feil ved innsending av skjemaet.");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!user) {
      alert("You must be logged in to add a beer.");
      return;
    }

    const newBeer: Beer = {
      name: "Standard Beer",
      brewery: "Standard Brewery",
      volume,
      createdBy: user._id as string, // Ensure this is a string
      createdByUsername: user.username,
    };

    mutation.mutate(newBeer);

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
