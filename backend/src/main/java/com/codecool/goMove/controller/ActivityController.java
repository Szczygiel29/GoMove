package com.codecool.goMove.controller;

import com.codecool.goMove.model.Activity;
import com.codecool.goMove.model.ActivityType;
import com.codecool.goMove.model.User;
import com.codecool.goMove.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public ResponseEntity<?> getAllActivities() {
        return ResponseEntity.status(HttpStatus.OK).body(activityService.getAllActivities());
    }

    @GetMapping("/future")
    public ResponseEntity<?> getFutureActivities() {
        return ResponseEntity.status(HttpStatus.OK).body(activityService.getFutureActivities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getActivityById(@PathVariable UUID id) {
        Activity activityById = activityService.getActivityById(id);
        if (activityById != null) {
            return ResponseEntity.status(HttpStatus.OK).body(activityById);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No activity with requested id");
    }

    @GetMapping("/filter")
    public ResponseEntity<?> getActivitiesByTypeAndCity(@RequestParam(required = false) String city,
                                                        @RequestParam(required = false) ActivityType type) {
        return ResponseEntity.status(HttpStatus.OK).body(activityService.getActivitiesByTypeAndCity(city, type));
    }

    @GetMapping("/user/{ownerId}")
    public ResponseEntity<?> getActivitiesByOwner(@PathVariable UUID ownerId) {
        return ResponseEntity.status(HttpStatus.OK).body(activityService.getActivitiesByOwner(ownerId));
    }

    @GetMapping("/participant/{participantId}")
    public ResponseEntity<?> getActivitiesByParticipant(@PathVariable UUID participantId) {
        return ResponseEntity.status(HttpStatus.OK).body(activityService.getActivitiesByParticipantId(participantId));
    }

    @GetMapping("/cities")
    public ResponseEntity<?> getAllCities() {
        return ResponseEntity.status(HttpStatus.OK).body(activityService.getAllCities());
    }

    @PostMapping
    public ResponseEntity<?> addActivity(@Valid @RequestBody Activity activity) {
        boolean addPerformed = activityService.addActivity(activity);
        if (addPerformed) {
            return ResponseEntity.status(HttpStatus.OK).body("Activity added");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Activity can't be in the past");
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<?> updateActivity(@RequestBody Activity activity, @PathVariable UUID id) {
        boolean updatePerformed = activityService.updateActivity(activity, id);
        if (updatePerformed) {
            return ResponseEntity.status(HttpStatus.OK).body("Activity updated");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No activity with requested id");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteActivity(@PathVariable UUID id) {
        boolean deletePerformed = activityService.deleteActivity(id);
        if (deletePerformed) {
            return ResponseEntity.status(HttpStatus.OK).body("Activity deleted");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No activity with requested id");
    }

    @PatchMapping("/unsubscribe-user/{userId}/{activityId}")
    public ResponseEntity<?> unsubscribeFromActivity(@PathVariable UUID userId, @PathVariable UUID activityId) {
        boolean isUnsubscribed = activityService.unsubscribeFromActivity(userId, activityId);
        if (isUnsubscribed) {
            return ResponseEntity.status(HttpStatus.OK).body("the user has signed out of the activity");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No activity with requested id");
    }
}
