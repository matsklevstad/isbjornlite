import React, { useState } from "react";
import {
  Modal,
  Button,
  Stack,
  SegmentedControl,
  Checkbox,
  TextInput,
  Textarea,
} from "@mantine/core";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { beerService } from "@/services/beerService";
import { Beer } from "@/models/beer";
import { useAuthStore } from "@/stores/authStore";

const AddBeerBtn = () => {
  const [opened, setOpened] = useState(false);
  const [volume, setVolume] = useState(""); // Selected volume from segmented control
  const [description, setDescription] = useState(""); // New state for description
  const [confirmed, setConfirmed] = useState(false);
  const { user } = useAuthStore();

  const queryClient = useQueryClient();

  // Create a mutation that uses your createBeer API function
  const mutation = useMutation<Beer, Error, Beer>({
    mutationFn: beerService.createBeer,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0];
          return ["latestBeers", "toplist", "userBeers"].includes(
            key as string
          );
        },
      });
      new Audio("./assets/open-beer-sound.mp3").play();
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
      description: description.trim() || undefined, // Only include if it has content
    };

    mutation.mutate(newBeer);

    // Close modal and reset fields
    setOpened(false);
    setVolume("");
    setDescription("");
    setConfirmed(false);
  };

  return (
    <>
      <button
        onClick={() => setOpened(true)}
        className="absolute left-1/2 -translate-x-1/2 bottom-10 z-10 opacity-90"
      >
        <IconCirclePlusFilled size={40} color="#ffffff" />
      </button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Register en ny isbjørn"
      >
        <form onSubmit={handleSubmit}>
          <Stack>
            <SegmentedControl
              color="isbjorn.8"
              data={[
                { label: "0.33 L", value: "0.33" },
                { label: "0.50 L", value: "0.50" },
              ]}
              value={volume}
              onChange={(value) => setVolume(value)}
            />

            <Textarea
              label="Beskrivelse (valgfri)"
              placeholder="Maks 20 tegn"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              autosize
              maxLength={20}
              minRows={2}
              maxRows={4}
            />

            <Checkbox
              label="Jeg bekrefter at jeg på ærlig og redlig vis har drukket opp en isbjørn lite."
              fs="italic"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.currentTarget.checked)}
            />
            <Button
              color="isbjorn.8"
              type="submit"
              disabled={!confirmed || !volume}
            >
              Legg til
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default AddBeerBtn;
