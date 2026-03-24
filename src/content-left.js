export function contentLeft() {
  return `<div class="filter-sidebar p-4 shadow-sm">
                    <div class="filter-group">
                        <h6 class="mb-3">Categories</h6>
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox" id="electronics">
                            <label class="form-check-label" for="electronics">
                                Electronics
                            </label>
                        </div>
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox" id="clothing">
                            <label class="form-check-label" for="clothing">
                                Clothing
                            </label>
                        </div>
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox" id="accessories">
                            <label class="form-check-label" for="accessories">
                                Accessories
                            </label>
                        </div>
                    </div>

                    <div class="filter-group">
                        <h6 class="mb-3">Price Range</h6>
                        <input type="range" class="form-range" min="0" max="1000" value="500">
                        <div class="d-flex justify-content-between">
                            <span class="text-muted">$0</span>
                            <span class="text-muted">$1000</span>
                        </div>
                    </div>

                    <div class="filter-group">
                        <h6 class="mb-3">Colors</h6>
                        <div class="d-flex gap-2">
                            <div class="color-option selected" style="background: #000000;"></div>
                            <div class="color-option" style="background: #dc2626;"></div>
                            <div class="color-option" style="background: #2563eb;"></div>
                            <div class="color-option" style="background: #16a34a;"></div>
                        </div>
                    </div>

                    <div class="filter-group">
                        <h6 class="mb-3">Rating</h6>
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="radio" name="rating" id="rating4">
                            <label class="form-check-label" for="rating4">
                                <i class="bi bi-star-fill text-warning"></i> 4 &amp; above
                            </label>
                        </div>
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="radio" name="rating" id="rating3">
                            <label class="form-check-label" for="rating3">
                                <i class="bi bi-star-fill text-warning"></i> 3 &amp; above
                            </label>
                        </div>
                    </div>

                    <button class="btn btn-outline-primary w-100">Apply Filters</button>
                </div>`;
}
