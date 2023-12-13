include(FetchContent)

FetchContent_Declare(
  webgpu-backend-dawn
  GIT_REPOSITORY https://github.com/eliemichel/WebGPU-distribution
  GIT_TAG        dawn-5869
  GIT_SHALLOW    TRUE
)
FetchContent_MakeAvailable(webgpu-backend-dawn)
