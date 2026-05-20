package aml.code.screeningservice.controller;


import aml.code.screeningservice.dto.request.ReviewRequest;
import aml.code.screeningservice.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PreAuthorize("hasAnyRole('ADMIN','OPERATOR', 'COMPLIANCE_OFFICER')")
    @PostMapping("/{id}/submit-review")
    public ResponseEntity<?> submitReview(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.submitForReview(id));
    }

    @PreAuthorize("hasRole('COMPLIANCE_OFFICER')")
    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id,
                                     @RequestBody ReviewRequest request,
                                     @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(reviewService.approve(id, request.getComment(), userDetails.getUsername()));
    }

    @PreAuthorize("hasRole('COMPLIANCE_OFFICER')")
    @PostMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id,
                                    @RequestBody ReviewRequest request,
                                    @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(reviewService.reject(id, request.getComment(), userDetails.getUsername()));
    }
}
