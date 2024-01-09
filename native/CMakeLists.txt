# Version 3.24.1:
# - is bundled in Visual Studio 2022 v17.4
# - is also bundled in CLion as of 2023
cmake_minimum_required(VERSION 3.24.1)

# Reads VERSION file and puts its value into CURRENT_VERSION variable.
# Be sure the file has no newlines!
file(STRINGS VERSION CURRENT_VERSION)

set(PROJECT_NAME "WebGPU")

project(
	${PROJECT_NAME}
	VERSION ${CURRENT_VERSION}
	LANGUAGES CXX C
)

# Include CMake utils
include(./cmake/CPM.cmake)
include(./cmake/utils.cmake)

# Turn on CPM cache
set(CPM_SOURCE_CACHE "./cpm-cache")

# Dependency: "glfw"
CPMAddPackage(
	NAME glfw
	GIT_TAG 3.3.9
	GIT_REPOSITORY https://github.com/glfw/glfw.git
)

# Dependency: "dawn"
set(DAWN_FETCH_DEPENDENCIES ON)
CPMAddPackage(
	NAME dawn
	VERSION 6237
	URL https://dawn.googlesource.com/dawn/+archive/refs/heads/chromium/6237.tar.gz
)

# Create the executable target
add_executable(App ./src/main.cpp)

# Include dependencies
target_link_libraries(App PRIVATE glfw webgpu_cpp webgpu_dawn webgpu_glfw)

# Use C++ 23
target_compile_features(App PRIVATE cxx_std_23)

# Xcode settings
if(XCODE)
	set_target_properties(App PROPERTIES
		XCODE_GENERATE_SCHEME ON
		XCODE_SCHEME_ENABLE_GPU_FRAME_CAPTURE_MODE "Metal"
	)
endif()

# Turn all warnings on and treat them as errors so that are not
# tempted to ignore them (See utils.cmake for details).
target_treat_all_warnings_as_errors(App)
