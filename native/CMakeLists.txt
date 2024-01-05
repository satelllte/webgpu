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

include(./cmake/utils.cmake)

# Include "glfw" third-party directory
add_subdirectory(./third-party/glfw)

# Create the App executable target with one source file
add_executable(App ./src/main.cpp)

# Include "glfw" dependency
target_link_libraries(App PRIVATE glfw)

# Use C++17
set_target_properties(App PROPERTIES CXX_STANDARD 17)

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
